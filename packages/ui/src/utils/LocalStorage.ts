// Copyright (C) 2023 Theros < MisModding | SvalTek >
//
//
// LocalStorageWrapper is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// LocalStorageWrapper is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with LocalStorageWrapper.  If not, see <http://www.gnu.org/licenses/>.

/**
 * @fileoverview simple localStorage wrapper for saving and loading settings and data
 * @author Theros < MisModding | SvalTek >
 * @version 1.0.0
 * @license GPL-3.0
 */

export default class LocalStorage {
  /**
   * @param {string} name - the name of the localStorage object
   * @param {string} [type] - the type of the localStorage object
   * @param {string|number|boolean|object} [fallback] - the fallback value of the localStorage object
   */
  constructor(name, type, fallback) {
    this.name = name;
    this.type = type;
    this.fallback = fallback;
  }

  /**
   * @description saves the localStorage object, set to null to delete the localStorage object
   * @param {string|number|boolean|object} value - the value of the localStorage object
   * @returns {boolean} true if the localStorage object was saved successfully
   * @throws {Error} if the localStorage object was not saved successfully
   * @example
   * const savedName = new LocalStorage('name', 'string', 'john doe');
   * console.log( localStorage.save("jane doe") );
   * ///> true
   */
  set(value) {
    if (value != null && !typeof value === this.type) {
      throw new Error(`Failed to save localStorage object: type mismatch, expected ${this.type}, got ${typeof value}`);
    }

    if (this.type === 'boolean') {
      value = toString(value);
    } else if (this.type === 'object') {
      value = JSON.stringify(value);
    }

    try {
      if (value === null) {
        localStorage.removeItem(this.name);
        return true;
      }
      localStorage.setItem(this.name, value);
      return true;
    } catch (error) {
      throw new Error(`Failed to save localStorage object: ${error}`);
    }
  }

  /**
   * @description loads the localStorage object
   * @returns {string|number|boolean|object} the value of the localStorage object
   * @throws {Error} if the localStorage object was not loaded successfully
   * @example
   * const savedName = new LocalStorage('name', 'string', 'john doe');
   * console.log( localStorage.load() );
   * ///> 'jane doe'
   */
  get() {
    try {
      const value = localStorage.getItem(this.name);
      if (value === null) {
        if (this.fallback === undefined) {
          throw new Error('Failed to load localStorage object: no fallback value provided');
        }
        return this.fallback;
      }
      if (!typeof value === this.type) {
        throw new Error(
          `Failed to load localStorage object: type mismatch, expected ${this.type}, got ${typeof value}`,
        );
      }
      if (this.type === 'boolean') {
        return Boolean(value);
      } else if (this.type === 'object') {
        return JSON.parse(value);
      }
      return value;
    } catch (error) {
      throw new Error(`Failed to load localStorage object: ${error}`);
    }
  }
}
