import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllStories, getStoryBySlug } from "@/lib/stories";
import { StoryReaderView } from "@/components/reader/StoryReaderView";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const stories = await getAllStories();
  return stories.map((story) => ({
    slug: story.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    return {
      title: "Story Not Found | GoLingread",
      description: "The requested English reading story could not be found.",
    };
  }

  return {
    title: `${story.title} (${story.level}) | GoLingread`,
    description: `${story.summary} | CEFR Level: ${story.level} • Category: ${story.category} • Read time: ${story.readTimeMinutes} min.`,
    keywords: [
      story.level,
      story.category,
      "English reading",
      "comprehensible input",
      "Krashen 95 percent input",
      story.title,
      "CEFR graded reader",
    ],
    openGraph: {
      title: `${story.title} - English Reading (${story.level}) | GoLingread`,
      description: story.summary,
      type: "article",
      images: [
        {
          url: story.coverImage,
          alt: story.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${story.title} (${story.level}) | GoLingread`,
      description: story.summary,
      images: [story.coverImage],
    },
  };
}

export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  return <StoryReaderView story={story} />;
}
