// hooks/api/engagement-hooks.ts
import {
    useFollowCreator,
    useGetConsumerFollowing,
    useGetConsumerFollowingCount,
    useGetCreatorFollowers,
    useGetCreatorFollowersCount,
    useIsFollowing,
    useUnfollowCreator,
} from '@/gen/api/hooks/user_management/consumer-creator-follows';

import {
    useLikeContent,
    useSaveContent,
    useUnlikeContent,
    useUnsaveContent,
} from '@/gen/api/hooks/content_management/engagement';

/**
 * Engagement hooks for social features
 * Provides organized interface for user engagement operations
 */
export const useEngagementHooks = () => ({
    // Following
    isFollowing: useIsFollowing,
    getFollowing: useGetConsumerFollowing,
    getFollowingCount: useGetConsumerFollowingCount,
    getFollowers: useGetCreatorFollowers,
    getFollowersCount: useGetCreatorFollowersCount,
    follow: useFollowCreator(),
    unfollow: useUnfollowCreator(),

    // Content interactions
    like: useLikeContent(),
    unlike: useUnlikeContent(),
    save: useSaveContent(),
    unsave: useUnsaveContent(),
});