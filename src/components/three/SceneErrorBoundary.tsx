import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  onError?: () => void
}

/**
 * Contains WebGL failures (no context, software rendering refused, lost GPU,
 * chunk failed to load). Renders nothing so the static hero chart stays visible.
 */
export class SceneErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    if (import.meta.env.DEV) console.info('[hero] 3D scene unavailable, keeping static chart.', error)
    this.props.onError?.()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
