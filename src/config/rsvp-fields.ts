/* ═════════════ THE RSVP FORM ═════════════
   Add, remove or reorder questions here. The form, its validation and
   the data sent to your endpoint are all built from this list.

   showIf: only show (and only send) a field when another field matches.
     { field: 'attending', equals: 'yes' }   exact value (or a list of values)
     { field: 'guests', min: 2 }             number is at least `min`            */

export type ShowIf = { field: string; equals?: string | string[]; min?: number };
type Base = {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  /** what to say when a required field is left empty */
  requiredMessage?: string;
  showIf?: ShowIf;
};
export type Option = { value: string; label: string };

export type Field =
  | (Base & { type: 'text' | 'email' | 'tel'; autocomplete?: string; maxlength?: number })
  | (Base & { type: 'textarea'; maxlength?: number })
  | (Base & { type: 'radio' | 'select'; options: Option[] })
  | (Base & { type: 'checkbox'; options: Option[] });

const attending: ShowIf = { field: 'attending', equals: 'yes' };

export const rsvpFields: Field[] = [
  { type: 'text', name: 'fullName', label: 'Full name', required: true, autocomplete: 'name', maxlength: 120 },
  { type: 'email', name: 'email', label: 'Email address', required: true, autocomplete: 'email', hint: "We'll only use this to send you wedding updates." },
  { type: 'tel', name: 'phone', label: 'Phone number', autocomplete: 'tel', hint: 'Optional. Useful if plans change on the day.' },
  {
    type: 'radio', name: 'attending', label: 'Will you attend?', required: true, requiredMessage: 'Choose whether you will attend.',
    options: [
      { value: 'yes', label: "Yes, I'll be there" },
      { value: 'no', label: "Regretfully, I can't attend" },
    ],
  },
  {
    type: 'select', name: 'guests', label: 'How many people are coming, including you?', required: true, requiredMessage: 'Choose how many people are coming, including you.', showIf: attending,
    hint: 'Please only include the people named on your invitation.',
    options: [1, 2, 3, 4].map((n) => ({ value: String(n), label: n === 1 ? 'Just me' : `${n} people` })),
  },
  { type: 'textarea', name: 'guestNames', label: 'Names of the people coming with you', required: true, requiredMessage: 'Enter the names of the people coming with you.', showIf: { field: 'guests', min: 2 }, maxlength: 400 },
  {
    type: 'checkbox', name: 'dietary', label: 'Dietary needs', showIf: attending, hint: 'Tick any that apply to your group.',
    options: [
      { value: 'vegetarian', label: 'Vegetarian' },
      { value: 'vegan', label: 'Vegan' },
      { value: 'halal', label: 'Halal' },
      { value: 'gluten-free', label: 'Gluten-free' },
      { value: 'nut-allergy', label: 'Nut allergy' },
    ],
  },
  { type: 'textarea', name: 'dietaryNotes', label: 'Other allergies or food notes', showIf: attending, maxlength: 400 },
  {
    type: 'textarea', name: 'access', label: 'Is there anything we can do to make the day easier for you?', showIf: attending, maxlength: 400,
    hint: 'For example step-free access, a seat near the front, or a quiet space to rest.',
  },
  { type: 'text', name: 'song', label: 'A song that will get you dancing', showIf: attending, maxlength: 120 },
  { type: 'textarea', name: 'message', label: 'Message for the couple', maxlength: 1000 },
];
