import LegalPageLayout from '@/components/common/legal-page-layout';

export const metadata = {
  title: 'Terms of Service | InsightFlow',
  description: 'Review the terms for using InsightFlow.',
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      eyebrow="InsightFlow terms"
      title="Terms of Service"
      description="These terms describe the responsibilities and conditions that apply when you use InsightFlow."
      updated="November 6, 2026"
    >
      <h2>1. Using InsightFlow</h2>
      <p>
        InsightFlow helps you turn uploaded audio and video into transcripts, summaries,
        actionable insights, and transcript-grounded questions and answers. You may use the
        service only in compliance with applicable laws and these terms.
      </p>

      <h2>2. Your account</h2>
      <p>
        You are responsible for keeping your account secure and for activity performed through
        your account. You must provide accurate account information and tell us if you believe
        your account has been used without permission.
      </p>

      <h2>3. Your content</h2>
      <p>
        You retain ownership of the audio, video, transcripts, notes, and other content you
        submit. You grant InsightFlow permission to store and process that content only as
        necessary to operate the service and provide its features.
      </p>

      <h2>4. Acceptable use</h2>
      <p>You must not use InsightFlow to:</p>
      <ul>
        <li>Upload content you do not have permission to use.</li>
        <li>Break the law, harm others, or violate another person&apos;s privacy.</li>
        <li>
          Upload malware or attempt to disrupt, probe, or gain unauthorized access to the service.
        </li>
        <li>Access, modify, or interfere with another user&apos;s workspace.</li>
        <li>Use automated activity that places an unreasonable burden on the service.</li>
      </ul>

      <h2>5. AI-generated content</h2>
      <p>
        Transcripts, summaries, takeaways, and answers are generated with automated systems.
        They may contain errors, omissions, or misleading conclusions. Review important output
        before relying on it, publishing it, or using it to make decisions.
      </p>

      <h2>6. Availability and changes</h2>
      <p>
        We may update, improve, limit, or temporarily suspend parts of InsightFlow. We will
        make reasonable efforts to keep the service available, but we do not promise that it
        will always be uninterrupted or error-free.
      </p>

      <h2>7. Suspension or termination</h2>
      <p>
        We may suspend or terminate access when it is reasonably necessary to protect the
        service, users, or third parties, or when these terms are violated.
      </p>

      <h2>8. Contact</h2>
      <p>
        Questions about these terms can be sent to{' '}
        <a href="mailto:insightflowai@gmail.com">insightflowai@gmail.com</a>.
      </p>
    </LegalPageLayout>
  );
}
