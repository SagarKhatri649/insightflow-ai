import LegalPageLayout from '@/components/common/legal-page-layout';

export const metadata = {
  title: 'Privacy Policy | InsightFlow',
  description: 'Learn how InsightFlow handles account information and uploaded content.',
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      eyebrow="InsightFlow privacy"
      title="Privacy Policy"
      description="This policy explains what information InsightFlow uses to provide transcription, summaries, and workspace features."
      updated="November 6, 2026"
    >
      <h2>1. Information we collect</h2>
      <p>
        When you use InsightFlow, we may collect account information provided through our sign-in
        provider, such as your name, email address, and account identifier. We also process the
        audio or video files you upload, the transcripts created from them, generated summaries
        and takeaways, and questions and answers created in your workspace.
      </p>

      <h2>2. How we use information</h2>
      <p>
        We use this information to authenticate you, organize workspace items, transcribe
        uploaded media, generate summaries and insights, answer questions about your uploaded
        content, provide support, and maintain the security and reliability of the service.
      </p>

      <h2>3. Service providers</h2>
      <p>
        InsightFlow uses third-party services for authentication, file storage, database hosting,
        transcription, and AI analysis. These providers process information only as needed to
        provide the requested service and may have their own privacy policies and terms.
      </p>

      <h2>4. Your uploaded content</h2>
      <p>
        You retain responsibility for the content you upload and must have the rights and
        permissions needed to use it. InsightFlow processes uploaded content to provide the
        features you request. Do not upload confidential or sensitive material unless you have
        assessed that InsightFlow is appropriate for it.
      </p>

      <h2>5. Storage, access, and deletion</h2>
      <p>
        Workspace content is associated with your account so you can return to your files,
        transcripts, summaries, and conversations. We use access controls intended to keep one
        user&apos;s workspace separate from another&apos;s. To request deletion of your account or
        workspace content, contact us at{' '}
        <a href="mailto:insightflowai@gmail.com">insightflowai@gmail.com</a>.
      </p>

      <h2>6. Security</h2>
      <p>
        We take reasonable measures to protect the information processed by InsightFlow. No
        online service can guarantee absolute security, so please use care when deciding what to
        upload.
      </p>

      <h2>7. Changes to this policy</h2>
      <p>
        We may update this policy as InsightFlow changes. If we make material changes, we will
        update the date shown at the top of this page.
      </p>

      <h2>8. Contact</h2>
      <p>
        Questions about privacy or data deletion can be sent to{' '}
        <a href="mailto:insightflowai@gmail.com">insightflowai@gmail.com</a>.
      </p>
    </LegalPageLayout>
  );
}
