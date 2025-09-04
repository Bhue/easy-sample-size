import { DecisionWizard } from '../../components/DecisionWizard'

export default function WizardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Help Me Choose</h1>
      <p className="text-slate-600 dark:text-slate-400">Answer a few yes/no questions to identify the appropriate statistical test and jump into the matching calculator.</p>
      <DecisionWizard />
    </div>
  )
}

