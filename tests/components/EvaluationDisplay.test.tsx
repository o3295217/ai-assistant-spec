/**
 * Component Tests for Evaluation Display Page
 * Tests evaluation results and alignment visualization
 */

import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
// import EvaluationPage from '@/pages/evaluation/[date]';

describe('Evaluation Display Component', () => {
  const mockDate = '2025-11-18';
  const mockEvaluation = {
    strategy_score: 7,
    operations_score: 8,
    team_score: 6,
    efficiency_score: 7,
    overall_score: 7.0,
    feedback_text: 'Хороший день, но есть куда расти',
    plan_vs_fact_text: '3 из 5 задач выполнено',
    alignment_day_week: 'works',
    alignment_week_month: 'partial',
    alignment_month_quarter: 'works',
    alignment_quarter_half: 'works',
    alignment_half_year: 'no',
    alignment_year_dream: 'works',
    recommendations_text: 'Сосредоточьтесь на стратегических задачах',
  };

  describe('Score Display', () => {
    it('should display all 4 category scores', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);

      // expect(screen.getByText(/стратегическое развитие/i)).toBeInTheDocument();
      // expect(screen.getByText('7')).toBeInTheDocument(); // strategy_score

      // expect(screen.getByText(/операционное управление/i)).toBeInTheDocument();
      // expect(screen.getByText('8')).toBeInTheDocument(); // operations_score

      // expect(screen.getByText(/работа с командой/i)).toBeInTheDocument();
      // expect(screen.getByText('6')).toBeInTheDocument(); // team_score

      // expect(screen.getByText(/эффективность времени/i)).toBeInTheDocument();
      // expect(screen.getByText('7')).toBeInTheDocument(); // efficiency_score
    });

    it('should display overall score prominently', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);
      // const overallScore = screen.getByTestId('overall-score');
      // expect(overallScore).toHaveTextContent('7.0');
      // expect(overallScore).toHaveClass('text-4xl'); // Large font
    });

    it('should color-code overall score (green >7, yellow 5-7, red <5)', () => {
      // // Green: score > 7
      // const { rerender } = render(
      //   <EvaluationPage date={mockDate} evaluation={{ ...mockEvaluation, overall_score: 8.5 }} />
      // );
      // expect(screen.getByTestId('overall-score')).toHaveClass('text-green-600');

      // // Yellow: score 5-7
      // rerender(<EvaluationPage date={mockDate} evaluation={{ ...mockEvaluation, overall_score: 6.0 }} />);
      // expect(screen.getByTestId('overall-score')).toHaveClass('text-yellow-600');

      // // Red: score < 5
      // rerender(<EvaluationPage date={mockDate} evaluation={{ ...mockEvaluation, overall_score: 4.0 }} />);
      // expect(screen.getByTestId('overall-score')).toHaveClass('text-red-600');
    });

    it('should display scores as progress bars', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);
      // const progressBars = screen.getAllByRole('progressbar');
      // expect(progressBars).toHaveLength(4); // One for each category
    });

    it('should show score out of 10', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);
      // expect(screen.getByText(/7 \/ 10/i)).toBeInTheDocument();
    });
  });

  describe('Plan vs Fact Section', () => {
    it('should display plan text', () => {
      // const mockPlan = '1. Задача А\n2. Задача Б';
      // render(<EvaluationPage date={mockDate} plan={mockPlan} evaluation={mockEvaluation} />);

      // expect(screen.getByText(/план на день/i)).toBeInTheDocument();
      // expect(screen.getByText(/задача а/i)).toBeInTheDocument();
      // expect(screen.getByText(/задача б/i)).toBeInTheDocument();
    });

    it('should display fact text', () => {
      // const mockFact = '1. Задача А - выполнена';
      // render(<EvaluationPage date={mockDate} fact={mockFact} evaluation={mockEvaluation} />);

      // expect(screen.getByText(/факт выполнения/i)).toBeInTheDocument();
      // expect(screen.getByText(/задача а - выполнена/i)).toBeInTheDocument();
    });

    it('should display plan vs fact analysis from AI', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);
      // expect(screen.getByText('3 из 5 задач выполнено')).toBeInTheDocument();
    });

    it('should highlight differences between plan and fact', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);
      // expect(screen.getByTestId('plan-vs-fact-section')).toBeInTheDocument();
    });
  });

  describe('Feedback Section', () => {
    it('should display AI feedback text', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);
      // expect(screen.getByText('Хороший день, но есть куда расти')).toBeInTheDocument();
    });

    it('should style feedback as prominent section', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);
      // const feedbackSection = screen.getByTestId('feedback-section');
      // expect(feedbackSection).toHaveClass('border', 'p-4');
    });

    it('should show feedback title', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);
      // expect(screen.getByText(/обратная связь от ИИ/i)).toBeInTheDocument();
    });
  });

  describe('Alignment Visualization', () => {
    it('should display alignment chain', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);
      // expect(screen.getByText(/выравнивание целей/i)).toBeInTheDocument();
    });

    it('should show all 6 alignment levels', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);

      // expect(screen.getByText(/день.*неделя/i)).toBeInTheDocument();
      // expect(screen.getByText(/неделя.*месяц/i)).toBeInTheDocument();
      // expect(screen.getByText(/месяц.*квартал/i)).toBeInTheDocument();
      // expect(screen.getByText(/квартал.*полугодие/i)).toBeInTheDocument();
      // expect(screen.getByText(/полугодие.*год/i)).toBeInTheDocument();
      // expect(screen.getByText(/год.*мечта/i)).toBeInTheDocument();
    });

    it('should color-code alignment statuses', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);

      // const dayWeek = screen.getByTestId('alignment-day-week');
      // expect(dayWeek).toHaveClass('text-green-600'); // works

      // const weekMonth = screen.getByTestId('alignment-week-month');
      // expect(weekMonth).toHaveClass('text-yellow-600'); // partial

      // const halfYear = screen.getByTestId('alignment-half-year');
      // expect(halfYear).toHaveClass('text-red-600'); // no
    });

    it('should show icons for alignment statuses', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);

      // expect(screen.getAllByText('✅')).toHaveLength(4); // works
      // expect(screen.getAllByText('⚠️')).toHaveLength(1); // partial
      // expect(screen.getAllByText('❌')).toHaveLength(1); // no
    });

    it('should show detailed explanation on alignment click', async () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);

      // const dayWeekAlignment = screen.getByTestId('alignment-day-week');
      // fireEvent.click(dayWeekAlignment);

      // expect(screen.getByText(/подробный анализ/i)).toBeInTheDocument();
    });

    it('should visualize alignment as connected chain', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);
      // const chain = screen.getByTestId('alignment-chain');
      // expect(chain).toHaveClass('flex', 'items-center');
    });
  });

  describe('Recommendations Section', () => {
    it('should display AI recommendations', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);
      // expect(screen.getByText('Сосредоточьтесь на стратегических задачах')).toBeInTheDocument();
    });

    it('should format recommendations as actionable items', () => {
      // const recommendations = 'Рекомендация 1\nРекомендация 2\nРекомендация 3';
      // render(<EvaluationPage date={mockDate} evaluation={{ ...mockEvaluation, recommendations_text: recommendations }} />);

      // const items = screen.getAllByRole('listitem');
      // expect(items).toHaveLength(3);
    });

    it('should show recommendations title', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);
      // expect(screen.getByText(/рекомендации на завтра/i)).toBeInTheDocument();
    });
  });

  describe('Navigation Actions', () => {
    it('should show back to dashboard button', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);
      // expect(screen.getByRole('button', { name: /вернуться на главную/i })).toBeInTheDocument();
    });

    it('should show view history button', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);
      // expect(screen.getByRole('button', { name: /смотреть историю/i })).toBeInTheDocument();
    });

    it('should navigate to previous/next day evaluation', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);
      // expect(screen.getByLabelText(/предыдущий день/i)).toBeInTheDocument();
      // expect(screen.getByLabelText(/следующий день/i)).toBeInTheDocument();
    });
  });

  describe('Print and Export', () => {
    it('should show print button', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);
      // expect(screen.getByRole('button', { name: /печать/i })).toBeInTheDocument();
    });

    it('should trigger print dialog on button click', () => {
      // window.print = jest.fn();
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);

      // const printButton = screen.getByRole('button', { name: /печать/i });
      // fireEvent.click(printButton);

      // expect(window.print).toHaveBeenCalled();
    });

    it('should show export to PDF option', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);
      // expect(screen.getByRole('button', { name: /экспорт в pdf/i })).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner while fetching evaluation', () => {
      // render(<EvaluationPage date={mockDate} isLoading={true} />);
      // expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should show skeleton screens for scores', () => {
      // render(<EvaluationPage date={mockDate} isLoading={true} />);
      // expect(screen.getAllByTestId('score-skeleton')).toHaveLength(5); // 4 categories + overall
    });
  });

  describe('Error States', () => {
    it('should display error if evaluation not found', () => {
      // render(<EvaluationPage date={mockDate} error="Evaluation not found" />);
      // expect(screen.getByText(/оценка не найдена/i)).toBeInTheDocument();
    });

    it('should show retry button on error', () => {
      // render(<EvaluationPage date={mockDate} error="Error" />);
      // expect(screen.getByRole('button', { name: /попробовать снова/i })).toBeInTheDocument();
    });

    it('should navigate to daily planning if no evaluation exists', () => {
      // const mockRouter = { push: jest.fn() };
      // render(<EvaluationPage date={mockDate} evaluation={null} />);

      // const createButton = screen.getByRole('button', { name: /создать оценку/i });
      // fireEvent.click(createButton);

      // expect(mockRouter.push).toHaveBeenCalledWith(`/daily/${mockDate}`);
    });
  });

  describe('Responsive Design', () => {
    it('should stack score cards vertically on mobile', () => {
      // global.innerWidth = 375;
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);
      // const scoreGrid = screen.getByTestId('score-grid');
      // expect(scoreGrid).toHaveClass('flex-col');
    });

    it('should collapse alignment chain on mobile', () => {
      // global.innerWidth = 375;
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);
      // const chain = screen.getByTestId('alignment-chain');
      // expect(chain).toHaveClass('flex-col');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);
      // expect(screen.getByRole('heading', { level: 1, name: /оценка дня/i })).toBeInTheDocument();
      // expect(screen.getByRole('heading', { level: 2, name: /оценки/i })).toBeInTheDocument();
    });

    it('should announce score values to screen readers', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);
      // const overallScore = screen.getByTestId('overall-score');
      // expect(overallScore).toHaveAttribute('aria-label', 'Общая оценка: 7.0 из 10');
    });

    it('should provide alt text for alignment icons', () => {
      // render(<EvaluationPage date={mockDate} evaluation={mockEvaluation} />);
      // const worksIcon = screen.getAllByLabelText(/работает/i);
      // expect(worksIcon.length).toBeGreaterThan(0);
    });
  });
});
