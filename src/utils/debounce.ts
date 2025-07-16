/**
 * Utility for debouncing operations in Google Apps Script environment
 * Provides a permission-friendly alternative to time-based triggers
 */

/**
 * Configuration for the debounce utility
 */
export interface DebounceConfig {
  /** Unique key prefix for this operation in PropertiesService */
  keyPrefix: string;
  /** Delay in milliseconds before allowing another operation */
  delayMs: number;
  /** Function to execute when debounce conditions are met */
  operation: () => void;
}

/**
 * Handles debounced operations with pending update tracking
 * This is designed to work within library permission constraints
 * by avoiding ScriptApp.newTrigger() which requires special permissions
 */
export class DebouncedOperation {
  private lastUpdateKey: string;
  private pendingUpdateKey: string;
  private delayMs: number;
  private operation: () => void;

  /**
   * Creates a new debounced operation
   * @param config Configuration for the debounced operation
   */
  constructor(config: DebounceConfig) {
    this.lastUpdateKey = `${config.keyPrefix}_lastUpdate`;
    this.pendingUpdateKey = `${config.keyPrefix}_pendingUpdate`;
    this.delayMs = config.delayMs;
    this.operation = config.operation;
  }

  /**
   * Attempts to execute the operation based on debounce rules
   * If the operation can't be executed now due to debounce,
   * it will be marked as pending and can be executed later
   */
  public trigger(): void {
    const props = PropertiesService.getScriptProperties();
    const now = Date.now();
    const lastUpdate = Number(props.getProperty(this.lastUpdateKey) || '0');
    
    // Always mark that an update is pending when triggered
    props.setProperty(this.pendingUpdateKey, 'true');
    
    // Only update if enough time has passed since the last update
    if (now - lastUpdate > this.delayMs) {
      // Store the current timestamp
      props.setProperty(this.lastUpdateKey, now.toString());
      
      // Clear the pending flag since we're updating now
      props.setProperty(this.pendingUpdateKey, 'false');
      
      // Execute the operation
      this.operation();
    }
    // Otherwise, do nothing - the pending flag ensures the operation
    // will be executed later when checkPending() is called
  }

  /**
   * Checks if there's a pending operation and executes it if needed
   * This should be called on spreadsheet open or other appropriate times
   * @returns true if a pending operation was executed, false otherwise
   */
  public checkPending(): boolean {
    const props = PropertiesService.getScriptProperties();
    const pendingUpdate = props.getProperty(this.pendingUpdateKey) === 'true';
    
    if (pendingUpdate) {
      // Clear the pending flag
      props.setProperty(this.pendingUpdateKey, 'false');
      
      // Update the timestamp
      props.setProperty(this.lastUpdateKey, Date.now().toString());
      
      // Execute the operation
      this.operation();
      return true;
    }
    
    return false;
  }
}

/**
 * Creates a debounced operation that can be triggered multiple times
 * but will only execute after the specified delay has passed
 * 
 * @param config Configuration for the debounced operation
 * @returns A DebouncedOperation instance
 * 
 * @example
 * // Create a debounced dashboard generator
 * const dashboardUpdater = createDebouncedOperation({
 *   keyPrefix: 'leadsDashboard',
 *   delayMs: 3000,
 *   operation: () => generateLeadsDashboard()
 * });
 * 
 * // In onEdit:
 * dashboardUpdater.trigger();
 * 
 * // In onOpen:
 * dashboardUpdater.checkPending();
 */
export function createDebouncedOperation(config: DebounceConfig): DebouncedOperation {
  return new DebouncedOperation(config);
}
