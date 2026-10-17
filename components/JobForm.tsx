"use client";
import { useFormState } from "react-dom";
import { saveJob, type FormState } from "@/app/actions";
import SubmitButton from "./SubmitButton";
import { PlusIcon } from "./icons";

export default function JobForm() {
  const [state, action] = useFormState<FormState, FormData>(saveJob, undefined);
  return (
    <form action={action} className="space-y-6">
      <div className="flex items-center gap-3">
        <PlusIcon />
        <div>
          <p className="text-sm font-semibold">New job</p>
          <p className="text-xs text-neutral-500">Job ID is assigned when you save</p>
        </div>
      </div>
      {state?.error && <p className="alert-error" role="alert">{state.error}</p>}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="additional_comments" className="mb-2 block text-sm font-semibold">Additional comments</label>
          <textarea id="additional_comments" name="additional_comments" rows={9} className="textarea" />
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input name="first_name" required className="input" placeholder="First name" aria-label="First name" />
            <input name="last_name" className="input" placeholder="Last name" aria-label="Last name" />
          </div>
          <input name="email" type="email" className="input" placeholder="Email" aria-label="Email" />
          <input name="phone" type="tel" className="input" placeholder="Phone" aria-label="Phone" />
          <div className="flex flex-wrap gap-3 pt-2">
            <SubmitButton name="intent" value="save" pendingLabel="Saving…">Save</SubmitButton>
            <SubmitButton name="intent" value="send" pendingLabel="Sending…">Send CRM</SubmitButton>
          </div>
        </div>
      </div>
    </form>
  );
}
