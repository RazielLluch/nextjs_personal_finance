import { useState, type ReactNode } from "react"

type EditableCellProps = {
  value: unknown
  displayValue: ReactNode
  inputType?: "text" | "date" | "number"
  disabled?: boolean
  onSubmit: (value: unknown) => Promise<void> | void
}

function toInputValue(value: unknown, inputType: EditableCellProps["inputType"]) {
  if (inputType === "date" && value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }
  return String(value ?? "")
}

export default function EditableCell({
  value,
  displayValue,
  inputType = "text",
  disabled = false,
  onSubmit,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(toInputValue(value, inputType))
  const [error, setError] = useState<string | null>(null)

  const finishEditing = async () => {
    const nextValue =
      inputType === "number"
        ? Number(editValue)
        : inputType === "date"
          ? new Date(`${editValue}T00:00:00`)
          : editValue

    if (
      (inputType === "number" && !Number.isFinite(nextValue)) ||
      (inputType === "date" && Number.isNaN((nextValue as Date).getTime()))
    ) {
      setError("Enter a valid value.")
      return
    }

    if (toInputValue(value, inputType) === editValue) {
      setIsEditing(false)
      return
    }

    try {
      await onSubmit(nextValue)
      setError(null)
      setIsEditing(false)
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to save this change.",
      )
    }
  }

  if (disabled) {
    return <span title="Split transactions can only be edited in their sub-rows">{displayValue}</span>
  }

  if (!isEditing) {
    return (
      <span
        className="block min-h-5 cursor-text rounded px-1 hover:bg-muted/50"
        onDoubleClick={() => {
          setEditValue(toInputValue(value, inputType))
          setIsEditing(true)
        }}
      >
        {displayValue}
      </span>
    )
  }

  return (
    <div className="relative min-h-5 min-w-0">
      <input
        className="absolute inset-0 h-full w-full min-w-0 rounded border bg-background px-1 py-0.5 outline-none focus:ring-1 focus:ring-ring"
        type={inputType}
        aria-label={inputType === "date" ? "Select date" : "Edit cell"}
        value={editValue}
        onChange={(event) => {
          setEditValue(event.target.value)
          setError(null)
        }}
        onFocus={(event) => {
          if (inputType === "date") {
            event.currentTarget.showPicker?.()
          }
        }}
        onBlur={() => void finishEditing()}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur()
          } else if (event.key === "Escape") {
            setEditValue(toInputValue(value, inputType))
            setError(null)
            setIsEditing(false)
          }
        }}
        autoFocus
      />
      {error ? (
        <p className="absolute left-0 top-full z-10 text-[10px] text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}