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
  /** Optional friendly name for toast notifications */
  operationName?: string;
  /** Whether to show toast notifications (defaults to true) */
  showToasts?: boolean;
  /** Duration in seconds to show the scheduled toast (defaults to 3) */
  scheduledToastDuration?: number;
  /** Duration in seconds to show the completed toast (defaults to 3) */
  completedToastDuration?: number;
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
  private operationName: string;
  private showToasts: boolean;
  private scheduledToastDuration: number;
  private completedToastDuration: number;

  /**
   * Creates a new debounced operation
   * @param config Configuration for the debounced operation
   */
  constructor(config: DebounceConfig) {
    this.lastUpdateKey = `${config.keyPrefix}_lastUpdate`;
    this.pendingUpdateKey = `${config.keyPrefix}_pendingUpdate`;
    this.delayMs = config.delayMs;
    this.operation = config.operation;
    this.operationName = config.operationName || 'Update';
    this.showToasts = config.showToasts !== false; // Default to true
    this.scheduledToastDuration = config.scheduledToastDuration || 3;
    this.completedToastDuration = config.completedToastDuration || 3;
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
    
    // Show toast notification for scheduled update
    if (this.showToasts) {
      SpreadsheetApp.getActiveSpreadsheet().toast(
        `${this.operationName} scheduled. Changes will appear in a few seconds.`,
        `${this.operationName} Pending`,
        this.scheduledToastDuration
      );
    }
    
    // Only update if enough time has passed since the last update
    if (now - lastUpdate > this.delayMs) {
      // Store the current timestamp
      props.setProperty(this.lastUpdateKey, now.toString());
      
      // Clear the pending flag since we're updating now
      props.setProperty(this.pendingUpdateKey, 'false');
      
      // Execute the operation
      this.operation();
      
      // Show toast notification for completed update
      if (this.showToasts) {
        SpreadsheetApp.getActiveSpreadsheet().toast(
          `${this.operationName} complete.`,
          `${this.operationName} Complete`,
          this.completedToastDuration
        );
      }
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
      // Show toast notification for pending update being processed
      if (this.showToasts) {
        SpreadsheetApp.getActiveSpreadsheet().toast(
          `Processing pending ${this.operationName.toLowerCase()}...`,
          `${this.operationName} Update`,
          this.scheduledToastDuration
        );
      }
      
      // Clear the pending flag
      props.setProperty(this.pendingUpdateKey, 'false');
      
      // Update the timestamp
      props.setProperty(this.lastUpdateKey, Date.now().toString());
      
      // Execute the operation
      this.operation();
      
      // Show toast notification for completed update
      if (this.showToasts) {
        SpreadsheetApp.getActiveSpreadsheet().toast(
          `${this.operationName} complete.`,
          `${this.operationName} Complete`,
          this.completedToastDuration
        );
      }
      
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
