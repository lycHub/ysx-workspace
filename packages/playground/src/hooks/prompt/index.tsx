import React from "react"
import { unstable_BlockerFunction as BlockerFunction } from "react-router-dom"

import useConfirm from "./useConfirm"

type ReactRouterPromptProps = {
  when: boolean | BlockerFunction
  children: (data: {
    isActive: boolean
    onCancel(): void
    onConfirm(): void
  }) => React.ReactNode
}

function ReactRouterPrompt({ when, children }: ReactRouterPromptProps) {
  const { isActive, onConfirm, resetConfirmation } = useConfirm(when)

  if (isActive) {
    return (
      <div>
        {children({
          isActive: true,
          onConfirm,
          onCancel: resetConfirmation,
        })}
      </div>
    )
  }
  return null
}

export default ReactRouterPrompt