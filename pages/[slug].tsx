import {
  GetBlogPostDocument,
  GetBlogPostQuery,
  GetBlogPostQueryVariables,
  GetBlogPostsDocument,
  GetBlogPostsQuery,
  GetBlogPostsQueryVariables,
  PostDetailed,
} from "@/generated/graphql";
import { createClient } from "@/lib/apollo";
import { NextPage } from "next";

type Props = {
  post: PostDetailed;
};
const BlogPage: NextPage<Props> = ({ post }) => {
  return (
    <div>
      <main>
        <h1>{post.title}</h1>
        <p>{post.dateAdded}</p>
        {post.tags?.map((tag, index) => (
          <p key={`${tag ?? index}`}>{tag?.__typename}</p>
        ))}
        <p>{post.contentMarkdown}</p>
      </main>
    </div>
  );
};

export default BlogPage;

type Path = {
  params: {
    slug: string;
  };
};

type StaticPaths = {
  paths: { params: { slug: string | null | undefined } }[] | undefined;
  fallback: boolean;
};
export const getStaticPaths = async (): Promise<StaticPaths> => {
  const client = createClient();

  const { data } = await client.query<
    GetBlogPostsQuery,
    GetBlogPostsQueryVariables
  >({ query: GetBlogPostsDocument });

  let paths;
  const posts = data.user?.publication?.posts;

  if (posts) {
    paths = data.user?.publication?.posts?.map((post) => {
      return {
        params: {
          slug: post?.slug,
        },
      };
    });
  }

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: Path) => {
  const client = createClient();

  const { data } = await client.query<
    GetBlogPostQuery,
    GetBlogPostQueryVariables
  >({
    query: GetBlogPostDocument,
    variables: {
      slug: params.slug,
      hostname: "carlw.hashnode.dev",
    },
  });

  const post = data.post;

  return {
    props: {
      post,
    },
  };
};
