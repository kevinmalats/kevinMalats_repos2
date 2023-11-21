import * as fs from 'fs';
import * as csv from 'csv-parser';
import * as moment from 'moment';

export class ValidationFiles {
  public async validateFile(file: any): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!file) {
          throw new Error('File not found');
        }
        if (!file || !file.path) {
          throw new Error('File upload failed');
        }
        const validTypes = ['text/csv'];
        if (validTypes.indexOf(file.mimetype) === -1) {
          throw new Error('The file is not a CSV');
        }

        const results = await this._parseCSVFile(file);
        this._validateEmptyFile(results);
        this._validateStatusField(results);
        this._validateAccount(results);
        this._validateLongCharacter('description', 500, results);
        const fields: string[] = ['id', 'balance'];
        this._validateTypeNumberField(fields, results);
        this._validateDateField(['date'], results);
        resolve(true);
      } catch (error) {

        reject(new Error(error));
      }
    });
  }
  private async _parseCSVFile(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          try {
            this._validateDuplicateFile(results);
            resolve(results);
          } catch (error) {
            reject(error);
          }

          //fs.unlinkSync(file.path);
        });
    });
  }

  private _validateEmptyFile(content: any[]): boolean {
    if (content.length === 0) {
      throw new Error('File is empty');
    }
    return true;
  }

  private _validateStatusField(results: any[]): boolean {
    const status = ['PENDING', 'PROCESSED'];
    console.log(results);
    for (let i = 0; i < results.length; i++) {
      const row = results[i];
      if (status.indexOf(row.status) === -1) {
        throw new Error('File contains invalid status');
      }
    }
    return true;
  }

  private _validateAccount(results: any[]): boolean {
    const account = ['INTERNAL', 'PEOPLE', 'OPERATIONS'];
    for (let i = 0; i < results.length; i++) {
      const row = results[i];
      if (account.indexOf(row.account) === -1) {
        throw new Error('File contains invalid status');
      }
    }
    return true;
  }

  private _validateLongCharacter(
    field: string,
    length: number,
    array: any[],
  ): boolean {
    for (let i = 0; i < array.length; i++) {
      const row = array[i];
      if (row[field].length > length) {
        throw new Error(`Field ${field} has more than ${length} characters`);
      }
    }

    return true;
  }

  private _validateTypeNumberField(
    fields: string[],
    arrayResults: any[],
  ): boolean {
    fields.forEach((field) => {
      console.log(field);
      for (let i = 0; i < arrayResults.length; i++) {
        const row = arrayResults[i];
        console.log( typeof row[field]);
        if (typeof row[field] == 'number') {
          throw new Error(`Field ${field} is not a number`);
        }
      }
    });

    return true;
  }

  private _validateDateField(
    fields: string[],
    arrayResults: any[],
  ): boolean {
    fields.forEach((field) => {
      for (let i = 0; i < arrayResults.length; i++) {
        const row = arrayResults[i];
        const date = moment(row[field], moment.ISO_8601, true);
        if (!date.isValid() || !date.isSame(moment(), 'day')) {
          throw new Error(`Field ${field} is not a valid UTC date or is not today's date`);
        }
      }
    });
  
    return true;
  }

  private _validateDuplicateFile(results: any): boolean {
    const uniqueResults = Array.from(
      new Set(results.map((result) => JSON.stringify(result))),
    ).map((result) => JSON.parse(result as string));
    if (results.length !== uniqueResults.length) {
      throw new Error('File contains duplicate rows');
    }
    return true;
  }
}
