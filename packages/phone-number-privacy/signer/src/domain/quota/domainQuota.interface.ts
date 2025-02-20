import { KnownDomain } from '@celo/identity/lib/odis/domains'
import Logger from 'bunyan'
import { Transaction } from 'knex'
import { DomainState } from '../../database/models/domainState'

export interface IDomainQuotaService {
  checkAndUpdateQuota: (
    domain: KnownDomain,
    domainState: DomainState,
    trx: Transaction<DomainState>,
    logger: Logger
  ) => Promise<{ sufficient: boolean; newState: DomainState }>
}
