import { withAlpha, mix } from '../color-utils.mjs';

/**
 * GitLens color keys mapped from brand palette.
 * Covers the most visible graph, gutter, and status indicators.
 */
export function getGitLensColors(p) {
  const { isDark, fg, mutedFg, primary, info, success, error, warning, purple, surface, editor } = p;

  const lane = (color, alpha = isDark ? 0.55 : 0.45) => withAlpha(color, alpha);

  return {
    'gitlens.gutterBackgroundColor': withAlpha(editor, 0.01),
    'gitlens.gutterForegroundColor': mutedFg,
    'gitlens.gutterUncommittedForegroundColor': warning,
    'gitlens.trailingLineForegroundColor': withAlpha(mutedFg, 0.55),
    'gitlens.lineHighlightBackgroundColor': withAlpha(primary, isDark ? 0.1 : 0.07),
    'gitlens.lineHighlightOverviewRulerColor': withAlpha(primary, 0.6),
    'gitlens.openautostashView.descriptionForeground': mutedFg,
    'gitlens.closedautostashView.descriptionForeground': mutedFg,
    'gitlens.decorations.branchAheadForegroundColor': success,
    'gitlens.decorations.branchBehindForegroundColor': warning,
    'gitlens.decorations.branchUpToDateForegroundColor': mutedFg,
    'gitlens.decorations.branchDivergedForegroundColor': error,
    'gitlens.decorations.branchUnpublishedForegroundColor': info,
    'gitlens.decorations.branchMissingUpstreamForegroundColor': warning,
    'gitlens.decorations.statusMergingOrRebasingConflictForegroundColor': error,
    'gitlens.decorations.statusMergingOrRebasingForegroundColor': warning,
    'gitlens.decorations.workspaceRepoMissingForegroundColor': mutedFg,
    'gitlens.decorations.workspaceCurrentForegroundColor': primary,
    'gitlens.decorations.workspaceRepoOpenForegroundColor': info,
    'gitlens.decorations.worktreeHasUncommittedForegroundColor': warning,
    'gitlens.decorations.worktreeMissingForegroundColor': error,
    'gitlens.graphLane1Color': lane(primary),
    'gitlens.graphLane2Color': lane(info),
    'gitlens.graphLane3Color': lane(success),
    'gitlens.graphLane4Color': lane(warning),
    'gitlens.graphLane5Color': lane(purple),
    'gitlens.graphLane6Color': lane(error),
    'gitlens.graphLane7Color': lane(mix(primary, info, 0.5)),
    'gitlens.graphLane8Color': lane(mix(success, warning, 0.5)),
    'gitlens.graphLane9Color': lane(mix(purple, primary, 0.5)),
    'gitlens.graphLane10Color': lane(mix(info, success, 0.5)),
    'gitlens.graphChangesColumnAddedColor': success,
    'gitlens.graphChangesColumnDeletedColor': error,
    'gitlens.graphMinimapMarkerHeadColor': primary,
    'gitlens.graphScrollMarkerHeadColor': primary,
    'gitlens.graphScrollMarkerLocalBranchColor': info,
    'gitlens.graphScrollMarkerRemoteBranchColor': purple,
    'gitlens.graphScrollMarkerTagColor': warning,
    'gitlens.graphScrollMarkerStashColor': mutedFg,
    'gitlens.launchpadIndicatorMergeableColor': success,
    'gitlens.launchpadIndicatorMergeableHoverColor': mix(success, '#FFFFFF', 0.15),
    'gitlens.launchpadIndicatorBlockedColor': error,
    'gitlens.launchpadIndicatorBlockedHoverColor': mix(error, '#FFFFFF', 0.15),
    'gitlens.launchpadIndicatorAttentionColor': warning,
    'gitlens.launchpadIndicatorAttentionHoverColor': mix(warning, '#FFFFFF', 0.15),
    'gitlens.unpublishedChangesIconColor': warning,
    'gitlens.unpublishedCommitIconColor': info,
    'gitlens.unpulledChangesIconColor': purple,
    'gitlens.unpushlishedCommitsIconColor': warning,
    'gitlens.closedPullRequestIconColor': mutedFg,
    'gitlens.openPullRequestIconColor': info,
    'gitlens.mergedPullRequestIconColor': purple,
    'gitlens.searchMatchFoundIconColor': success,
    'gitlens.searchMatchSelectedIconColor': primary,
    'gitlens.plusIconColor': success,
    'gitlens.minimapMarkerHeadColor': primary,
    'gitlens.minimapMarkerLocalBranchColor': info,
    'gitlens.minimapMarkerRemoteBranchColor': purple,
    'gitlens.minimapMarkerTagColor': warning,
    'gitlens.minimapMarkerStashColor': mutedFg,
    'gitlens.minimapMarkerHighlightsColor': withAlpha(warning, 0.8),
    'gitlens.minimapMarkerSelectionColor': withAlpha(primary, 0.8),
    'gitlens.hovers.currentLine.backgroundColor': withAlpha(surface, isDark ? 0.9 : 0.95),
    'gitlens.hovers.currentLine.foregroundColor': fg,
    'gitlens.hovers.avatarsBorderColor': withAlpha(border(p), 0.5),
    'gitlens.hovers.changes.addedForegroundColor': success,
    'gitlens.hovers.changes.deletedForegroundColor': error,
    'gitlens.hovers.changes.modifiedForegroundColor': info,
  };
}

function border(p) {
  return p.border;
}
