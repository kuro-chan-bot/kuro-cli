<%_ if (standardPlugin) { _%>
import { KuroConfiguration } from '@kuro-chan/framework'
<%_ } _%>

export const botConfig: KuroConfiguration = {
  /**
   * Prefixes.
   */
  prefixes: [],

  /**
   * Providers.
   */
  providers: [],

  /**
   * Commands.
   */
  commands: [],

  /**
   * Listeners.
   */
  listeners: [],

  /**
   * Loggers.
   */
  loggers: [],

  /**
   * Plugins.
   */
  plugins: [<%= standardPlugin ? 'new StandardPlugin()' : '' %>],
}