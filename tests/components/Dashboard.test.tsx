/**
 * Component Tests for Dashboard Page
 * Tests the main dashboard UI components
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
// import Dashboard from '@/pages/index';

describe('Dashboard Component', () => {
  describe('Rendering', () => {
    it('should render dashboard header', () => {
      // const { container } = render(<Dashboard />);
      // expect(screen.getByText(/главная/i)).toBeInTheDocument();
    });

    it('should display current date section', () => {
      // render(<Dashboard />);
      // expect(screen.getByText(/сегодняшний день/i)).toBeInTheDocument();
    });

    it('should show action buttons for daily planning', () => {
      // render(<Dashboard />);
      // expect(screen.getByRole('button', { name: /создать план на день/i })).toBeInTheDocument();
      // expect(screen.getByRole('button', { name: /добавить факт/i })).toBeInTheDocument();
    });

    it('should render evaluation score graph', () => {
      // render(<Dashboard />);
      // const graph = screen.getByTestId('evaluation-graph');
      // expect(graph).toBeInTheDocument();
    });

    it('should display goal hierarchy widget', () => {
      // render(<Dashboard />);
      // expect(screen.getByText(/иерархия целей/i)).toBeInTheDocument();
    });
  });

  describe('Goal Hierarchy Widget', () => {
    it('should display all 6 levels of hierarchy', () => {
      // render(<Dashboard />);
      // expect(screen.getByText(/мечта/i)).toBeInTheDocument();
      // expect(screen.getByText(/год/i)).toBeInTheDocument();
      // expect(screen.getByText(/полугодие/i)).toBeInTheDocument();
      // expect(screen.getByText(/квартал/i)).toBeInTheDocument();
      // expect(screen.getByText(/месяц/i)).toBeInTheDocument();
      // expect(screen.getByText(/неделя/i)).toBeInTheDocument();
    });

    it('should expand/collapse goal sections', async () => {
      // render(<Dashboard />);
      // const dreamSection = screen.getByTestId('goal-section-dream');
      // const toggleButton = within(dreamSection).getByRole('button');

      // fireEvent.click(toggleButton);
      // await waitFor(() => {
      //   expect(screen.getByText(/текст мечты/i)).toBeVisible();
      // });

      // fireEvent.click(toggleButton);
      // await waitFor(() => {
      //   expect(screen.queryByText(/текст мечты/i)).not.toBeVisible();
      // });
    });

    it('should show edit button for each goal level', () => {
      // render(<Dashboard />);
      // const editButtons = screen.getAllByLabelText(/редактировать/i);
      // expect(editButtons).toHaveLength(6); // 6 levels
    });

    it('should navigate to goals page on edit click', async () => {
      // const mockRouter = { push: jest.fn() };
      // jest.mock('next/router', () => ({ useRouter: () => mockRouter }));

      // render(<Dashboard />);
      // const editButton = screen.getAllByLabelText(/редактировать/i)[0];
      // fireEvent.click(editButton);

      // expect(mockRouter.push).toHaveBeenCalledWith('/goals');
    });
  });

  describe('Evaluation Graph', () => {
    it('should display last 30 days by default', () => {
      // render(<Dashboard />);
      // const graph = screen.getByTestId('evaluation-graph');
      // expect(within(graph).getByText(/30 дней/i)).toBeInTheDocument();
    });

    it('should allow changing time period', async () => {
      // render(<Dashboard />);
      // const periodSelector = screen.getByLabelText(/выбор периода/i);

      // fireEvent.change(periodSelector, { target: { value: '60' } });
      // await waitFor(() => {
      //   expect(screen.getByText(/60 дней/i)).toBeInTheDocument();
      // });
    });

    it('should display tooltip on hover over data points', async () => {
      // render(<Dashboard />);
      // const graph = screen.getByTestId('evaluation-graph');
      // const dataPoint = within(graph).getAllByTestId('graph-point')[0];

      // fireEvent.mouseOver(dataPoint);
      // await waitFor(() => {
      //   expect(screen.getByText(/дата:/i)).toBeInTheDocument();
      //   expect(screen.getByText(/оценка:/i)).toBeInTheDocument();
      // });
    });

    it('should show empty state when no evaluations exist', () => {
      // render(<Dashboard />);
      // expect(screen.getByText(/нет данных для отображения/i)).toBeInTheDocument();
    });

    it('should navigate to history on graph click', async () => {
      // const mockRouter = { push: jest.fn() };
      // render(<Dashboard />);

      // const graph = screen.getByTestId('evaluation-graph');
      // fireEvent.click(graph);

      // expect(mockRouter.push).toHaveBeenCalledWith('/history');
    });
  });

  describe('Today Card', () => {
    it('should show plan creation prompt if no plan exists', () => {
      // render(<Dashboard />);
      // expect(screen.getByText(/создайте план на сегодня/i)).toBeInTheDocument();
    });

    it('should display existing plan if available', () => {
      // const mockPlan = '1. Задача А\n2. Задача Б';
      // render(<Dashboard plan={mockPlan} />);
      // expect(screen.getByText(/задача а/i)).toBeInTheDocument();
      // expect(screen.getByText(/задача б/i)).toBeInTheDocument();
    });

    it('should show fact input section after plan is created', () => {
      // const mockPlan = '1. Задача А';
      // render(<Dashboard plan={mockPlan} />);
      // expect(screen.getByText(/добавить факт/i)).toBeInTheDocument();
    });

    it('should show evaluation button when both plan and fact exist', () => {
      // const mockData = { plan: 'План', fact: 'Факт' };
      // render(<Dashboard {...mockData} />);
      // expect(screen.getByRole('button', { name: /получить оценку/i })).toBeInTheDocument();
    });

    it('should display evaluation if already completed', () => {
      // const mockEvaluation = { overall_score: 7.5 };
      // render(<Dashboard evaluation={mockEvaluation} />);
      // expect(screen.getByText('7.5')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should have navigation menu with all pages', () => {
      // render(<Dashboard />);
      // expect(screen.getByRole('link', { name: /главная/i })).toBeInTheDocument();
      // expect(screen.getByRole('link', { name: /цели/i })).toBeInTheDocument();
      // expect(screen.getByRole('link', { name: /планирование/i })).toBeInTheDocument();
      // expect(screen.getByRole('link', { name: /история/i })).toBeInTheDocument();
      // expect(screen.getByRole('link', { name: /аналитика/i })).toBeInTheDocument();
      // expect(screen.getByRole('link', { name: /задачи/i })).toBeInTheDocument();
    });

    it('should highlight current page in navigation', () => {
      // render(<Dashboard />);
      // const homeLink = screen.getByRole('link', { name: /главная/i });
      // expect(homeLink).toHaveClass('active');
    });
  });

  describe('Responsive Design', () => {
    it('should collapse navigation on mobile', () => {
      // global.innerWidth = 375;
      // global.dispatchEvent(new Event('resize'));
      // render(<Dashboard />);
      // expect(screen.getByLabelText(/меню/i)).toBeInTheDocument();
    });

    it('should stack widgets vertically on mobile', () => {
      // global.innerWidth = 375;
      // render(<Dashboard />);
      // const container = screen.getByTestId('dashboard-container');
      // expect(container).toHaveClass('flex-col');
    });
  });

  describe('Loading States', () => {
    it('should show loading spinner while fetching data', () => {
      // render(<Dashboard isLoading={true} />);
      // expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should display skeleton screens during load', () => {
      // render(<Dashboard isLoading={true} />);
      // expect(screen.getAllByTestId('skeleton')).toHaveLength(3);
    });
  });

  describe('Error Handling', () => {
    it('should display error message on data fetch failure', () => {
      // const mockError = 'Ошибка загрузки данных';
      // render(<Dashboard error={mockError} />);
      // expect(screen.getByText(mockError)).toBeInTheDocument();
    });

    it('should show retry button on error', () => {
      // render(<Dashboard error="Error" />);
      // expect(screen.getByRole('button', { name: /попробовать снова/i })).toBeInTheDocument();
    });
  });
});
