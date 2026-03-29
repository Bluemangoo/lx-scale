import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SurveyShareEntryPage({ params }: PageProps) {
  const { id } = await params;
  redirect(`/survey/${id}/main`);
}
