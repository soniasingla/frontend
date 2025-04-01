import { useRouter } from 'next/router';
import React from 'react';

import type { NavItemInternal, NavItem, NavGroupItem } from 'types/client/navigation';

import config from 'configs/app';
import { rightLineArrow } from 'lib/html-entities';

interface ReturnType {
  mainNavItems: Array<NavItem | NavGroupItem>;
  accountNavItems: Array<NavItem>;
}

export function isGroupItem(item: NavItem | NavGroupItem): item is NavGroupItem {
  return 'subItems' in item;
}

export function isInternalItem(item: NavItem): item is NavItemInternal {
  return 'nextRoute' in item;
}

export default function useNavItems(): ReturnType {
  const router = useRouter();
  const pathname = router.pathname;

  return React.useMemo(() => {
    let blockchainNavItems: Array<NavItem> | Array<Array<NavItem>> = [];

    const topAccounts: NavItem | null = !config.UI.views.address.hiddenViews?.top_accounts ? {
      text: 'Top accounts',
      nextRoute: { pathname: '/accounts' as const },
      icon: 'top-accounts',
      isActive: pathname === '/accounts',
    } : null;
    const blocks: NavItem | null = {
      text: 'Blocks',
      nextRoute: { pathname: '/blocks' as const },
      icon: 'block',
      isActive: pathname === '/blocks' || pathname === '/block/[height_or_hash]',
    };
    const txs: NavItem | null = {
      text: 'Transactions',
      nextRoute: { pathname: '/txs' as const },
      icon: 'transactions',
      isActive: pathname === '/txs' || pathname === '/tx/[hash]',
    };
    const internalTxs: NavItem | null = {
      text: 'Internal transactions',
      nextRoute: { pathname: '/internal-txs' as const },
      icon: 'internal_txns',
      isActive: pathname === '/internal-txs',
    };
    const userOps: NavItem | null = config.features.userOps.isEnabled ? {
      text: 'User operations',
      nextRoute: { pathname: '/ops' as const },
      icon: 'user_op',
      isActive: pathname === '/ops' || pathname === '/op/[hash]',
    } : null;

    const verifiedContracts: NavItem | null = null;
    const ensLookup = config.features.nameService.isEnabled ? {
      text: 'Name services lookup',
      nextRoute: { pathname: '/name-domains' as const },
      icon: 'ENS',
      isActive: pathname === '/name-domains' || pathname === '/name-domains/[name]',
    } : null;
    const validators = config.features.validators.isEnabled ? {
      text: 'Top validators',
      nextRoute: { pathname: '/validators' as const },
      icon: 'validator',
      isActive: pathname === '/validators' || pathname === '/validators/[id]',
    } : null;
    const rollupDeposits = {
      text: `Deposits (L1${ rightLineArrow }L2)`,
      nextRoute: { pathname: '/deposits' as const },
      icon: 'arrows/south-east',
      isActive: pathname === '/deposits',
    };
    const rollupWithdrawals = {
      text: `Withdrawals (L2${ rightLineArrow }L1)`,
      nextRoute: { pathname: '/withdrawals' as const },
      icon: 'arrows/north-east',
      isActive: pathname === '/withdrawals',
    };
    const rollupTxnBatches = {
      text: 'Txn batches',
      nextRoute: { pathname: '/batches' as const },
      icon: 'txn_batches',
      isActive: pathname === '/batches',
    };
    const rollupOutputRoots = {
      text: 'Output roots',
      nextRoute: { pathname: '/output-roots' as const },
      icon: 'output_roots',
      isActive: pathname === '/output-roots',
    };
    const rollupDisputeGames = config.features.faultProofSystem.isEnabled ? {
      text: 'Dispute games',
      nextRoute: { pathname: '/dispute-games' as const },
      icon: 'games',
      isActive: pathname === '/dispute-games',
    } : null;
    const mudWorlds = config.features.mudFramework.isEnabled ? {
      text: 'MUD worlds',
      nextRoute: { pathname: '/mud-worlds' as const },
      icon: 'MUD_menu',
      isActive: pathname === '/mud-worlds',
    } : null;

    const rollupFeature = config.features.rollup;

    const rollupInteropMessages = rollupFeature.isEnabled && rollupFeature.interopEnabled ? {
      text: 'Interop messages',
      nextRoute: { pathname: '/interop-messages' as const },
      icon: 'interop',
      isActive: pathname === '/interop-messages',
    } : null;

    if (rollupFeature.isEnabled && (
      rollupFeature.type === 'optimistic' ||
      rollupFeature.type === 'arbitrum' ||
      rollupFeature.type === 'zkEvm' ||
      rollupFeature.type === 'scroll'
    )) {
      blockchainNavItems = [
        [
          txs,
          internalTxs,
          rollupDeposits,
          rollupWithdrawals,
          rollupInteropMessages,
        ].filter(Boolean),
        [
          blocks,
          rollupTxnBatches,
          rollupDisputeGames,
          rollupFeature.outputRootsEnabled ? rollupOutputRoots : undefined,
        ].filter(Boolean),
        [
          userOps,
          topAccounts,
          mudWorlds,
          validators,
          verifiedContracts,
          ensLookup,
        ].filter(Boolean),
      ];
    } else if (rollupFeature.isEnabled && rollupFeature.type === 'shibarium') {
      blockchainNavItems = [
        [
          txs,
          internalTxs,
          rollupDeposits,
          rollupWithdrawals,
        ],
        [
          blocks,
          userOps,
          topAccounts,
          verifiedContracts,
          ensLookup,
        ].filter(Boolean),
      ];
    } else if (rollupFeature.isEnabled && rollupFeature.type === 'zkSync') {
      blockchainNavItems = [
        [
          txs,
          internalTxs,
          userOps,
          blocks,
          rollupTxnBatches,
        ].filter(Boolean),
        [
          topAccounts,
          validators,
          verifiedContracts,
          ensLookup,
        ].filter(Boolean),
      ];
    } else {
      blockchainNavItems = [
        txs,
        internalTxs,
        userOps,
        blocks,
        topAccounts,
        validators,
        verifiedContracts,
        ensLookup,
        config.features.beaconChain.isEnabled && {
          text: 'Withdrawals',
          nextRoute: { pathname: '/withdrawals' as const },
          icon: 'arrows/north-east',
          isActive: pathname === '/withdrawals',
        },
      ].filter(Boolean);
    }

    const apiNavItems: Array<NavItem> = [
      config.features.graphqlApiDocs.isEnabled ? {
        text: 'GraphQL',
        nextRoute: { pathname: '/graphiql' as const },
        icon: 'graphQL',
        isActive: pathname === '/graphiql',
      } : null,
      !config.UI.navigation.hiddenLinks?.rpc_api && {
        text: 'RPC API',
        icon: 'RPC',
        url: 'https://docs.blockscout.com/for-users/api/rpc-endpoints',
      },
      !config.UI.navigation.hiddenLinks?.eth_rpc_api && {
        text: 'Eth RPC API',
        icon: 'RPC',
        url: ' https://docs.blockscout.com/for-users/api/eth-rpc',
      },
    ].filter(Boolean);

    const mainNavItems: ReturnType['mainNavItems'] = [
      {
        text: 'Blockchain',
        icon: 'globe-b',
        isActive: blockchainNavItems.flat().some(item => isInternalItem(item) && item.isActive),
        subItems: blockchainNavItems,
      },
      config.features.marketplace.isEnabled ? {
        text: 'DApps',
        nextRoute: { pathname: '/apps' as const },
        icon: 'apps',
        isActive: pathname.startsWith('/app'),
      } : null,
      config.features.stats.isEnabled ? {
        text: 'Charts & stats',
        nextRoute: { pathname: '/stats' as const },
        icon: 'stats',
        isActive: pathname.startsWith('/stats'),
      } : null,
      apiNavItems.length > 0 && {
        text: 'API',
        icon: 'restAPI',
        isActive: apiNavItems.some(item => isInternalItem(item) && item.isActive),
        subItems: apiNavItems,
      },
    ].filter(Boolean);

    const accountNavItems: ReturnType['accountNavItems'] = [
      {
        text: 'Watch list',
        nextRoute: { pathname: '/account/watchlist' as const },
        icon: 'watchlist',
        isActive: pathname === '/account/watchlist',
      },
      {
        text: 'Private tags',
        nextRoute: { pathname: '/account/tag-address' as const },
        icon: 'privattags',
        isActive: pathname === '/account/tag-address',
      },
      {
        text: 'API keys',
        nextRoute: { pathname: '/account/api-key' as const },
        icon: 'API',
        isActive: pathname === '/account/api-key',
      },
      {
        text: 'Custom ABI',
        nextRoute: { pathname: '/account/custom-abi' as const },
        icon: 'ABI',
        isActive: pathname === '/account/custom-abi',
      },
      config.features.addressVerification.isEnabled && {
        text: 'Verified addrs',
        nextRoute: { pathname: '/account/verified-addresses' as const },
        icon: 'verified',
        isActive: pathname === '/account/verified-addresses',
      },
    ].filter(Boolean);

    return { mainNavItems, accountNavItems };
  }, [ pathname ]);
}
