'use client';
import { useEffect, useState } from 'react';
import { MONTHS } from '@/lib/site';

type State = 'idle' | 'sending' | 'ok' | 'error';

/** Request form. Props preselect a tour; ?tur=<code> in the URL does too. Validates in the browser and on the server. */
export function RequestForm({ tour = '', tourLabel = '', id = 'request' }: { tour?: string; tourLabel?: string; id?: string }) {
  const [state, setState] = useState<State>('idle');
  const [t, setT] = useState(tour);
  useEffect(() => { const q = new URLSearchParams(location.search).get('tur'); if (q) setT(q); }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const r = await fetch('/api/zayavka', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
      setState(r.ok ? 'ok' : 'error');
    } catch { setState('error'); }
  }

  if (state === 'ok') {
    return (
      <div className="form-done" role="status">
        <p className="form-done__title">Спасибо, заявка у нас.</p>
        <p>Мы напишем вам с подборкой дат, отелей и ценой. Дели на 2,5 часа впереди Москвы, поэтому утром ответ может прийти раньше, чем вы проснётесь.</p>
      </div>
    );
  }
  return (
    <form className="form" onSubmit={submit} id={id}>
      <label className="field"><span>Как вас зовут</span><input name="name" required maxLength={80} autoComplete="name" /></label>
      <label className="field"><span>Телефон, Telegram или почта</span><input name="contact" required minLength={3} maxLength={120} autoComplete="tel" /></label>
      <label className="field">
        <span>Что вас интересует</span>
        <select name="tour" value={t} onChange={(e) => setT(e.target.value)}>
          <option value="">Пока не выбрали, нужен совет</option>
          {tourLabel && tour && <option value={tour}>{tourLabel}</option>}
          {t && t !== tour && !t.startsWith('month-') && <option value={t}>Программа {t}</option>}
          {MONTHS.map((m, i) => <option key={m} value={`month-${i + 1}`}>Хочу поехать в месяце: {m.toLowerCase()}</option>)}
        </select>
      </label>
      <label className="field field--short"><span>Сколько вас едет</span><input name="people" type="number" min={1} max={50} defaultValue={2} required /></label>
      <label className="field field--wide"><span>Что важно в поездке</span><textarea name="message" rows={3} maxLength={1000} /></label>
      <input className="hp" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="form__foot">
        <button className="btn" type="submit" disabled={state === 'sending'}>
          <span className="btn__label">{state === 'sending' ? 'Отправляем' : 'Отправить заявку'}</span>
          <span className="btn__arrow" aria-hidden="true">→</span>
        </button>
        <p className="form__note" aria-live="polite">
          {state === 'error' ? 'Не получилось отправить. Напишите нам в WhatsApp или на почту, она ниже.' : 'Мы используем ваши данные только для ответа на заявку.'}
        </p>
      </div>
    </form>
  );
}
