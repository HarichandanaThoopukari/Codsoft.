import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuiz } from '../services/api.js';
import QuestionForm from '../components/QuestionForm.jsx';
import DashboardSidebar from '../components/DashboardSidebar.jsx';

const emptyQuestion = () => ({
  questionText: '',
  options: ['', '', '', ''],
  correctAnswer: '',
});

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', category: '', difficulty: 'Medium',
  });
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFormChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    if (typeof field === 'number') {
      updated[index].options[field] = value;
    } else {
      updated[index][field] = value;
    }
    setQuestions(updated);
  };

  const addQuestion = () => setQuestions([...questions, emptyQuestion()]);

  const removeQuestion = (index) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) { setError(`Question ${i + 1}: Enter question text`); return; }
      if (q.options.some((o) => !o.trim())) { setError(`Question ${i + 1}: Fill all 4 options`); return; }
      if (!q.correctAnswer) { setError(`Question ${i + 1}: Select the correct answer`); return; }
    }

    setLoading(true);
    try {
      await createQuiz({ ...form, questions });
      navigate('/quizzes');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="section-title">Create a Quiz</h1>
          <p className="mt-1 text-slate-400">Build a new quiz with custom questions</p>
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <DashboardSidebar />

          <main className="flex-1 min-w-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="error-msg">{error}</div>}

              {/* Quiz Details */}
              <div className="card space-y-4">
                <h2 className="font-semibold text-white">Quiz details</h2>

                <div>
                  <label className="label">Title</label>
                  <input name="title" value={form.title} onChange={handleFormChange} placeholder="e.g. JavaScript Basics" required />
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea name="description" value={form.description} onChange={handleFormChange} rows={3} placeholder="What is this quiz about?" required className="resize-none" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Category</label>
                    <input name="category" value={form.category} onChange={handleFormChange} placeholder="e.g. Programming" required />
                  </div>
                  <div>
                    <label className="label">Difficulty</label>
                    <select name="difficulty" value={form.difficulty} onChange={handleFormChange}>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-white">Questions ({questions.length})</h2>
                  <button type="button" onClick={addQuestion} disabled={loading} className="btn-secondary py-2 text-xs">
                    + Add Question
                  </button>
                </div>

                {questions.map((q, i) => (
                  <QuestionForm
                    key={i}
                    index={i}
                    question={q}
                    onChange={handleQuestionChange}
                    onRemove={removeQuestion}
                    disabled={loading}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
                  {loading ? 'Publishing...' : 'Publish Quiz'}
                </button>
                <button type="button" onClick={() => navigate('/quizzes')} disabled={loading} className="btn-secondary py-3 px-6">
                  Cancel
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
