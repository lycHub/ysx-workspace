import { useCallback, useEffect } from "react"
import {
  useBeforeUnload,
  unstable_useBlocker as useBlocker,
  unstable_Blocker as Blocker,
  unstable_BlockerFunction as BlockerFunction,
} from "react-router-dom"

function usePrompt(when: boolean | BlockerFunction): Blocker {
  const blocker = useBlocker(when)
  useEffect(() => {
    // Reset if when is updated to false
    if (blocker.state === "blocked" && !when) {
      blocker.reset()
    }
  }, [blocker, when])

  useBeforeUnload(
    useCallback(
      (event) => {
        if (when) {
          event.preventDefault()
          // eslint-disable-next-line no-param-reassign
          event.returnValue = "Changes that you made may not be saved."
        }
      },
      [when],
    ),
    { capture: true },
  )

  return blocker
}

export default usePrompt