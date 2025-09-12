// hooks/creator-hooks.ts
export {
    useDeleteCreator,
    useGetCreator as useCreator,
    useGetCreatorByTeam,
    useGetCreators,
    useGetVerifiedCreators,
    useUpdateCreator,
} from '@/gen/api/hooks/user_management/creators';

export {
    useGetCreatorSuggestions,
} from '@/gen/api/hooks/user_management/consumer-creator-follows';

export {
    useGetContents as useCreatorPosts,
    useCreateContent as useCreateCreatorPost,
    useGetContentsInfinite as useCreatorPostsInfinite,
} from '@/gen/api/hooks/content_management/content';

// Re-export the comprehensive creator hooks for advanced usage
export { useCreatorHooks } from '@/hooks/api/creator-hooks';