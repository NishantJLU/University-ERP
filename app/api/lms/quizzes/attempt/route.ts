import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT" || !user.studentId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Enrolled student credentials required." },
        { status: 403 }
      );
    }

    const { quizId, answers } = await req.json(); // answers: Record<string, number> (questionId -> selectedOptionIndex)

    if (!quizId || !answers) {
      return NextResponse.json(
        { success: false, message: "Quiz ID and selected answers are required." },
        { status: 400 }
      );
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) {
      return NextResponse.json({ success: false, message: "Quiz not found." }, { status: 404 });
    }

    // Auto-calculate score
    let calculatedScore = 0;
    const questionBreakdown: any[] = [];

    for (const q of quiz.questions) {
      const selectedOption = answers[q.id];
      const isCorrect = selectedOption === q.correctOption;
      if (isCorrect) {
        calculatedScore += q.marks;
      }
      questionBreakdown.push({
        questionId: q.id,
        questionText: q.questionText,
        selectedOption,
        correctOption: q.correctOption,
        isCorrect,
        marksAwarded: isCorrect ? q.marks : 0,
      });
    }

    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        studentId: user.studentId,
        answersJson: JSON.stringify(answers),
        score: calculatedScore,
        maxScore: quiz.totalMarks,
        startedAt: new Date(Date.now() - 15 * 60 * 1000), // simulated 15m duration
        completedAt: new Date(),
      },
    });

    await createAuditLog({
      actor: user,
      action: "QUIZ_COMPLETED",
      entity: "QuizAttempt",
      entityId: attempt.id,
      details: {
        quizTitle: quiz.title,
        score: calculatedScore,
        maxScore: quiz.totalMarks,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Quiz completed! You scored ${calculatedScore} / ${quiz.totalMarks}`,
      score: calculatedScore,
      maxScore: quiz.totalMarks,
      percentage: Math.round((calculatedScore / quiz.totalMarks) * 100),
      breakdown: questionBreakdown,
    });
  } catch (error) {
    console.error("Quiz submission error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to evaluate quiz attempt." },
      { status: 500 }
    );
  }
}
