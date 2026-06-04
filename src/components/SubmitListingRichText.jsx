import { useCallback, useEffect, useRef } from "react";

const COMMANDS = [
  { cmd: "bold", label: "B", title: "Gras" },
  { cmd: "italic", label: "I", title: "Italique", style: { fontStyle: "italic" } },
  { cmd: "underline", label: "U", title: "Souligné", style: { textDecoration: "underline" } },
  { cmd: "strikeThrough", label: "S", title: "Barré", style: { textDecoration: "line-through" } },
];

/**
 * Zone de texte enrichi léger (contentEditable) pour la tarification.
 */
export default function SubmitListingRichText({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  "aria-label": ariaLabel,
}) {
  const editorRef = useRef(null);

  useEffect(() => {
    const el = editorRef.current;
    if (!el || document.activeElement === el) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value || "";
    }
  }, [value]);

  const emitChange = useCallback(() => {
    const html = editorRef.current?.innerHTML ?? "";
    onChange(html);
  }, [onChange]);

  const runCommand = (cmd) => {
    if (disabled) return;
    editorRef.current?.focus();
    document.execCommand(cmd, false, null);
    emitChange();
  };

  const runList = (ordered) => {
    if (disabled) return;
    editorRef.current?.focus();
    document.execCommand(ordered ? "insertOrderedList" : "insertUnorderedList", false, null);
    emitChange();
  };

  return (
    <div className="submit-listing-rich">
      <div className="submit-listing-rich__toolbar" role="toolbar" aria-label="Mise en forme">
        {COMMANDS.map(({ cmd, label, title, style }) => (
          <button
            key={cmd}
            type="button"
            className="submit-listing-rich__btn"
            title={title}
            disabled={disabled}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => runCommand(cmd)}
          >
            <span style={style}>{label}</span>
          </button>
        ))}
        <button
          type="button"
          className="submit-listing-rich__btn"
          title="Liste à puces"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runList(false)}
        >
          •
        </button>
        <button
          type="button"
          className="submit-listing-rich__btn"
          title="Liste numérotée"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runList(true)}
        >
          1.
        </button>
      </div>
      <div
        id={id}
        ref={editorRef}
        className="submit-listing-rich__editor"
        contentEditable={!disabled}
        role="textbox"
        aria-label={ariaLabel}
        aria-multiline="true"
        data-placeholder={placeholder}
        suppressContentEditableWarning
        onInput={emitChange}
        onBlur={emitChange}
      />
    </div>
  );
}
