import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0908]">
          <div className="text-center">
            <p className="text-sm text-[#5a5550]">Something went wrong. Please refresh the page.</p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 text-xs text-[#4a4540] underline hover:text-[#c8c0b4]"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
