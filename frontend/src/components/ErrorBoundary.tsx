import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(_: Error, __: ErrorInfo) {
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto mt-10 max-w-lg rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-ink">Something went wrong</h2>
          <p className="mt-2 text-sm text-slate-600">Refresh the page or check the API connection.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
