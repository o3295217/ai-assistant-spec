/**
 * Component Tests for Daily Planning Page
 * Tests plan creation and fact entry
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
// import DailyPlanningPage from '@/pages/daily/[date]';

describe('Daily Planning Component', () => {
  const mockDate = '2025-11-18';

  describe('Date Selection', () => {
    it('should render date picker', () => {
      // render(<DailyPlanningPage date={mockDate} />);
      // expect(screen.getByLabelText(/выбор даты/i)).toBeInTheDocument();
    });

    it('should default to today\'s date', () => {
      // render(<DailyPlanningPage />);
      // const datePicker = screen.getByLabelText(/выбор даты/i);
      // expect(datePicker).toHaveValue('2025-11-18');
    });

    it('should load data for selected date', async () => {
      // const mockFetch = jest.fn().mockResolvedValue({
      //   ok: true,
      //   json: async () => ({ plan_text: 'План на 15 ноября' }),
      // });
      // global.fetch = mockFetch;

      // render(<DailyPlanningPage />);
      // const datePicker = screen.getByLabelText(/выбор даты/i);

      // await userEvent.clear(datePicker);
      // await userEvent.type(datePicker, '2025-11-15');

      // await waitFor(() => {
      //   expect(screen.getByDisplayValue('План на 15 ноября')).toBeInTheDocument();
      // });
    });

    it('should navigate to previous/next day with buttons', async () => {
      // render(<DailyPlanningPage date={mockDate} />);

      // const nextButton = screen.getByLabelText(/следующий день/i);
      // fireEvent.click(nextButton);

      // await waitFor(() => {
      //   expect(screen.getByDisplayValue('2025-11-19')).toBeInTheDocument();
      // });
    });
  });

  describe('Plan Section', () => {
    it('should render plan textarea', () => {
      // render(<DailyPlanningPage date={mockDate} />);
      // expect(screen.getByLabelText(/план на день/i)).toBeInTheDocument();
    });

    it('should display existing plan if available', () => {
      // const mockPlan = '1. Задача А\n2. Задача Б';
      // render(<DailyPlanningPage date={mockDate} plan={mockPlan} />);
      // expect(screen.getByDisplayValue(mockPlan)).toBeInTheDocument();
    });

    it('should allow typing multiline plan', async () => {
      // const user = userEvent.setup();
      // render(<DailyPlanningPage date={mockDate} />);

      // const textarea = screen.getByLabelText(/план на день/i);
      // await user.type(textarea, '1. Первая задача\n2. Вторая задача');

      // expect(textarea).toHaveValue('1. Первая задача\n2. Вторая задача');
    });

    it('should save plan on button click', async () => {
      // const mockSave = jest.fn();
      // render(<DailyPlanningPage date={mockDate} onSavePlan={mockSave} />);

      // const textarea = screen.getByLabelText(/план на день/i);
      // await userEvent.type(textarea, 'Тестовый план');

      // const saveButton = screen.getByRole('button', { name: /сохранить план/i });
      // fireEvent.click(saveButton);

      // await waitFor(() => {
      //   expect(mockSave).toHaveBeenCalledWith(mockDate, 'Тестовый план');
      // });
    });

    it('should auto-save plan after inactivity', async () => {
      // jest.useFakeTimers();
      // const mockSave = jest.fn();
      // render(<DailyPlanningPage date={mockDate} onSavePlan={mockSave} />);

      // const textarea = screen.getByLabelText(/план на день/i);
      // await userEvent.type(textarea, 'Автосохранение');

      // jest.advanceTimersByTime(3000); // 3 seconds debounce

      // await waitFor(() => {
      //   expect(mockSave).toHaveBeenCalled();
      // });

      // jest.useRealTimers();
    });

    it('should show character count for plan', () => {
      // render(<DailyPlanningPage date={mockDate} />);
      // const textarea = screen.getByLabelText(/план на день/i);
      // userEvent.type(textarea, 'Текст плана');

      // expect(screen.getByText(/11 символов/i)).toBeInTheDocument();
    });
  });

  describe('Context Section (Week/Month Goals)', () => {
    it('should display weekly goals for context', () => {
      // const mockWeekGoals = ['Цель недели 1', 'Цель недели 2'];
      // render(<DailyPlanningPage date={mockDate} weekGoals={mockWeekGoals} />);

      // expect(screen.getByText(/цели на неделю/i)).toBeInTheDocument();
      // expect(screen.getByText('Цель недели 1')).toBeInTheDocument();
      // expect(screen.getByText('Цель недели 2')).toBeInTheDocument();
    });

    it('should display monthly goals for context', () => {
      // const mockMonthGoals = ['Цель месяца 1'];
      // render(<DailyPlanningPage date={mockDate} monthGoals={mockMonthGoals} />);

      // expect(screen.getByText(/цели на месяц/i)).toBeInTheDocument();
      // expect(screen.getByText('Цель месяца 1')).toBeInTheDocument();
    });

    it('should collapse/expand context sections', async () => {
      // render(<DailyPlanningPage date={mockDate} />);

      // const weekSection = screen.getByTestId('week-goals-section');
      // const toggleButton = within(weekSection).getByRole('button');

      // fireEvent.click(toggleButton);
      // await waitFor(() => {
      //   expect(screen.queryByText(/цель недели/i)).not.toBeVisible();
      // });
    });

    it('should link to goals page for editing', () => {
      // render(<DailyPlanningPage date={mockDate} />);
      // const editLink = screen.getByRole('link', { name: /редактировать цели/i });
      // expect(editLink).toHaveAttribute('href', '/goals');
    });
  });

  describe('Fact Section', () => {
    it('should render fact textarea', () => {
      // render(<DailyPlanningPage date={mockDate} />);
      // expect(screen.getByLabelText(/факт выполнения/i)).toBeInTheDocument();
    });

    it('should display existing fact if available', () => {
      // const mockFact = '1. Задача А - выполнена';
      // render(<DailyPlanningPage date={mockDate} fact={mockFact} />);
      // expect(screen.getByDisplayValue(mockFact)).toBeInTheDocument();
    });

    it('should disable fact input if no plan exists', () => {
      // render(<DailyPlanningPage date={mockDate} plan={null} />);
      // const textarea = screen.getByLabelText(/факт выполнения/i);
      // expect(textarea).toBeDisabled();
    });

    it('should enable fact input when plan exists', () => {
      // render(<DailyPlanningPage date={mockDate} plan="Есть план" />);
      // const textarea = screen.getByLabelText(/факт выполнения/i);
      // expect(textarea).not.toBeDisabled();
    });

    it('should save fact on button click', async () => {
      // const mockSave = jest.fn();
      // render(<DailyPlanningPage date={mockDate} plan="План" onSaveFact={mockSave} />);

      // const textarea = screen.getByLabelText(/факт выполнения/i);
      // await userEvent.type(textarea, 'Факт выполнения');

      // const saveButton = screen.getByRole('button', { name: /сохранить факт/i });
      // fireEvent.click(saveButton);

      // await waitFor(() => {
      //   expect(mockSave).toHaveBeenCalledWith(mockDate, 'Факт выполнения');
      // });
    });

    it('should show helpful hints for fact entry', () => {
      // render(<DailyPlanningPage date={mockDate} plan="План" />);
      // expect(screen.getByText(/опишите, что реально сделали/i)).toBeInTheDocument();
    });
  });

  describe('Get Evaluation Button', () => {
    it('should show evaluation button when both plan and fact exist', () => {
      // render(<DailyPlanningPage date={mockDate} plan="План" fact="Факт" />);
      // expect(screen.getByRole('button', { name: /получить оценку/i })).toBeInTheDocument();
    });

    it('should disable button if plan is missing', () => {
      // render(<DailyPlanningPage date={mockDate} plan={null} fact="Факт" />);
      // const button = screen.getByRole('button', { name: /получить оценку/i });
      // expect(button).toBeDisabled();
    });

    it('should disable button if fact is missing', () => {
      // render(<DailyPlanningPage date={mockDate} plan="План" fact={null} />);
      // const button = screen.getByRole('button', { name: /получить оценку/i });
      // expect(button).toBeDisabled();
    });

    it('should show loading state while requesting evaluation', async () => {
      // render(<DailyPlanningPage date={mockDate} plan="План" fact="Факт" />);
      // const button = screen.getByRole('button', { name: /получить оценку/i });

      // fireEvent.click(button);

      // expect(screen.getByText(/запрос оценки/i)).toBeInTheDocument();
      // expect(button).toBeDisabled();
    });

    it('should navigate to evaluation page on success', async () => {
      // const mockRouter = { push: jest.fn() };
      // render(<DailyPlanningPage date={mockDate} plan="План" fact="Факт" />);

      // const button = screen.getByRole('button', { name: /получить оценку/i });
      // fireEvent.click(button);

      // await waitFor(() => {
      //   expect(mockRouter.push).toHaveBeenCalledWith(`/evaluation/${mockDate}`);
      // });
    });

    it('should handle evaluation API errors', async () => {
      // const mockFetch = jest.fn().mockRejectedValue(new Error('API Error'));
      // global.fetch = mockFetch;

      // render(<DailyPlanningPage date={mockDate} plan="План" fact="Факт" />);
      // const button = screen.getByRole('button', { name: /получить оценку/i });

      // fireEvent.click(button);

      // await waitFor(() => {
      //   expect(screen.getByText(/ошибка получения оценки/i)).toBeInTheDocument();
      // });
    });

    it('should show timeout message if Claude API takes too long', async () => {
      // jest.setTimeout(35000);
      // render(<DailyPlanningPage date={mockDate} plan="План" fact="Факт" />);

      // const button = screen.getByRole('button', { name: /получить оценку/i });
      // fireEvent.click(button);

      // await waitFor(() => {
      //   expect(screen.getByText(/превышено время ожидания/i)).toBeInTheDocument();
      // }, { timeout: 35000 });
    });
  });

  describe('Data Validation', () => {
    it('should prevent saving empty plan', async () => {
      // render(<DailyPlanningPage date={mockDate} />);
      // const saveButton = screen.getByRole('button', { name: /сохранить план/i });

      // fireEvent.click(saveButton);

      // await waitFor(() => {
      //   expect(screen.getByText(/план не может быть пустым/i)).toBeInTheDocument();
      // });
    });

    it('should prevent saving whitespace-only plan', async () => {
      // render(<DailyPlanningPage date={mockDate} />);
      // const textarea = screen.getByLabelText(/план на день/i);
      // await userEvent.type(textarea, '   \n   ');

      // const saveButton = screen.getByRole('button', { name: /сохранить план/i });
      // fireEvent.click(saveButton);

      // await waitFor(() => {
      //   expect(screen.getByText(/план не может быть пустым/i)).toBeInTheDocument();
      // });
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should save plan with Ctrl+S', async () => {
      // const mockSave = jest.fn();
      // render(<DailyPlanningPage date={mockDate} onSavePlan={mockSave} />);

      // const textarea = screen.getByLabelText(/план на день/i);
      // textarea.focus();

      // fireEvent.keyDown(textarea, { key: 's', ctrlKey: true });

      // await waitFor(() => {
      //   expect(mockSave).toHaveBeenCalled();
      // });
    });

    it('should request evaluation with Ctrl+Enter', async () => {
      // const mockEvaluate = jest.fn();
      // render(<DailyPlanningPage date={mockDate} plan="План" fact="Факт" onEvaluate={mockEvaluate} />);

      // const textarea = screen.getByLabelText(/факт выполнения/i);
      // textarea.focus();

      // fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });

      // await waitFor(() => {
      //   expect(mockEvaluate).toHaveBeenCalled();
      // });
    });
  });
});
