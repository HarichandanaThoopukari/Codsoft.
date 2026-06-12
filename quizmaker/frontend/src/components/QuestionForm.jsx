const QuestionForm = ({ index, question, onChange, onRemove, disabled }) => (
  <div className="card border-[#2a2a45] animate-slide-up">
    <div className="mb-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600/30 text-sm font-bold text-brand-300">
          {index + 1}
        </span>
        <h3 className="font-semibold text-white">Question {index + 1}</h3>
      </div>
      <button
        disabled={disabled}
        onClick={() => onRemove(index)}
        className="btn-danger py-1.5 text-xs"
      >
        Remove
      </button>
    </div>

    <div className="space-y-4">
      <div>
        <label className="label">Question text</label>
        <textarea
          value={question.questionText}
          onChange={(e) => onChange(index, 'questionText', e.target.value)}
          rows={3}
          placeholder="Enter your question here..."
          disabled={disabled}
          className="resize-none"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {['A', 'B', 'C', 'D'].map((letter, optionIndex) => (
          <div key={letter}>
            <label className="label">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-brand-600/30 text-[10px] font-bold text-brand-300 mr-1.5">
                {letter}
              </span>
              Option {letter}
            </label>
            <input
              value={question.options[optionIndex]}
              onChange={(e) => onChange(index, optionIndex, e.target.value)}
              placeholder={`Option ${letter}`}
              disabled={disabled}
            />
          </div>
        ))}
      </div>

      <div>
        <label className="label">Correct answer</label>
        <select
          value={question.correctAnswer}
          onChange={(e) => onChange(index, 'correctAnswer', e.target.value)}
          disabled={disabled}
        >
          <option value="">Select correct answer</option>
          {question.options.map((option, i) => (
            <option key={i} value={option}>
              {option || `Option ${String.fromCharCode(65 + i)}`}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
);

export default QuestionForm;
