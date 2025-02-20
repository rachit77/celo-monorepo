import { domainHash, KnownDomain } from '@celo/identity/lib/odis/domains'
import { DB_TIMEOUT, ErrorMessage } from '@celo/phone-number-privacy-common'
import Logger from 'bunyan'
import { Transaction } from 'knex'
import { Counters, Histograms, Labels } from '../../common/metrics'
import { getDatabase } from '../database'
import { DOMAINS_STATES_COLUMNS, DOMAINS_STATES_TABLE, DomainState } from '../models/domainState'

function domainsStates() {
  return getDatabase()<DomainState>(DOMAINS_STATES_TABLE)
}

export async function setDomainDisabled(domain: KnownDomain, logger: Logger): Promise<void> {
  const disableDomainMeter = Histograms.dbOpsInstrumentation.labels('disableDomain').startTimer()
  const hash = domainHash(domain).toString('hex')
  logger.debug('Disabling domain', { hash, domain })
  try {
    await domainsStates()
      .where(DOMAINS_STATES_COLUMNS.domainHash, hash)
      .update(DOMAINS_STATES_COLUMNS.disabled, true)
      .timeout(DB_TIMEOUT)
    disableDomainMeter()
  } catch (err) {
    Counters.databaseErrors.labels(Labels.update).inc()
    logger.error(ErrorMessage.DATABASE_UPDATE_FAILURE)
    logger.error(err)
    disableDomainMeter()
    throw err
  } finally {
    disableDomainMeter()
  }
}

export async function getDomainState(
  domain: KnownDomain,
  logger: Logger
): Promise<DomainState | null> {
  const getDomainStateMeter = Histograms.dbOpsInstrumentation.labels('getDomainState').startTimer()
  const hash = domainHash(domain).toString('hex')
  logger.debug('Getting domain state from db', { hash, domain })
  try {
    const result = await domainsStates()
      .where(DOMAINS_STATES_COLUMNS.domainHash, hash)
      .first()
      .timeout(DB_TIMEOUT)
    getDomainStateMeter()
    return result ?? null
  } catch (err) {
    Counters.databaseErrors.labels(Labels.read).inc()
    logger.error(ErrorMessage.DATABASE_GET_FAILURE)
    logger.error(err)
    getDomainStateMeter()
    throw err
  } finally {
    getDomainStateMeter()
  }
}

export async function getDomainStateWithLock(
  domain: KnownDomain,
  trx: Transaction<DomainState>,
  logger: Logger
): Promise<DomainState | null> {
  const getDomainStateWithLockMeter = Histograms.dbOpsInstrumentation
    .labels('getDomainStateWithLock')
    .startTimer()
  const hash = domainHash(domain).toString('hex')
  logger.debug('Getting domain state from db with lock', { hash, domain })
  try {
    const result = await domainsStates()
      .transacting(trx)
      .forUpdate()
      .where(DOMAINS_STATES_COLUMNS.domainHash, hash)
      .first()
      .timeout(DB_TIMEOUT)
    getDomainStateWithLockMeter()
    return result ?? null
  } catch (err) {
    Counters.databaseErrors.labels(Labels.read).inc()
    logger.error(ErrorMessage.DATABASE_GET_FAILURE)
    logger.error(err)
    getDomainStateWithLockMeter()
    throw err
  } finally {
    getDomainStateWithLockMeter()
  }
}

export async function updateDomainState(
  domain: KnownDomain,
  domainState: DomainState,
  trx: Transaction<DomainState>,
  logger: Logger
): Promise<void> {
  const updateDomainStateMeter = Histograms.dbOpsInstrumentation
    .labels('updateDomainState')
    .startTimer()
  const hash = domainHash(domain).toString('hex')
  logger.debug('Update domain state', { hash, domain, domainState })
  try {
    const result = await domainsStates()
      .transacting(trx)
      .where(DOMAINS_STATES_COLUMNS.domainHash, hash)
      .first()
      .timeout(DB_TIMEOUT)

    if (!result) {
      await insertDomainState(domainState, trx, logger)
    } else {
      await domainsStates()
        .transacting(trx)
        .where(DOMAINS_STATES_COLUMNS.domainHash, hash)
        .update(domainState)
        .timeout(DB_TIMEOUT)
    }
    updateDomainStateMeter()
  } catch (err) {
    Counters.databaseErrors.labels(Labels.update).inc()
    logger.error(ErrorMessage.DATABASE_UPDATE_FAILURE)
    logger.error(err)
    updateDomainStateMeter()
    throw err
  } finally {
    updateDomainStateMeter()
  }
}

export async function insertDomainState(
  domainState: DomainState,
  trx: Transaction<DomainState>,
  logger: Logger
): Promise<DomainState> {
  const insertDomainStateMeter = Histograms.dbOpsInstrumentation
    .labels('insertDomainState')
    .startTimer()
  logger.debug('Insert domain state', { domainState })
  try {
    await domainsStates().transacting(trx).insert(domainState).timeout(DB_TIMEOUT)

    insertDomainStateMeter()

    return domainState
  } catch (err) {
    Counters.databaseErrors.labels(Labels.insert).inc()
    logger.error(ErrorMessage.DATABASE_INSERT_FAILURE)
    logger.error(err)
    insertDomainStateMeter()
    throw err
  } finally {
    insertDomainStateMeter()
  }
}
