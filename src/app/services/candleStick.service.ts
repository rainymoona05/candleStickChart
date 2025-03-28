import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tutorial } from '../models/tutorial.model';
import * as Papa from 'papaparse';

const baseUrl = 'http://localhost:8080/api/tutorials';

@Injectable({
  providedIn: 'root',
})
export class TutorialService { 
  constructor(private http: HttpClient) {}

  getAll(): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(baseUrl);
  }

  get(id: any): Observable<Tutorial> {
    return this.http.get<Tutorial>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByTitle(title: any): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(`${baseUrl}?title=${title}`);
  }
  // parseCsv(csvData: string): any[] {
  //   const result = Papa.parse(csvData, {
  //     header: true,
  //     skipEmptyLines: true
  //   });

  //   // Extract only specific columns (modify as needed)
  //   return result.data.map((row: any) => ({
  //     DATE: row.DATE,
  //     OPEN: row.OPEN,
  //     HIGH: row.HIGH,
  //     LOW: row.LOW,
  //     CLOSE: row.CLOSE,
  //     VOLUME: row.VOLUME
  //   }));
  // }

  convertDateFormat(dateStr: string): string {
    const months: { [key: string]: number } = {
      "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6,
      "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12
    };
  
    const parts = dateStr.split('-'); // Example: "09-Jun-05" → ["09", "Jun", "05"]
    const day = parts[0].padStart(2, '0'); // Ensure two-digit day
    const month = months[parts[1]]; // Convert "Jun" to 6
    const shortYear = parseInt(parts[2], 10); // Extract "05"
  
    // Determine full year (assuming 20xx for years 00-99)
    const currentYear = new Date().getFullYear();
    const century = Math.floor(currentYear / 100) * 100; // Get the current century (e.g., 2000, 2100)
    const year = shortYear < 50 ? century + shortYear : (century - 100) + shortYear; // Adjust century
  
    return `${year}/${month}/${day}`;
  }
    
  parseCsv(csvData: string): any[][] {
    const result = Papa.parse(csvData, {
      header: true, // Read headers but extract only values
      skipEmptyLines: true
    });

    // Extract only values (ignoring keys)
    return result.data.map((row: any) => [
      (this.convertDateFormat(row.DATE).toString()),
      Number(row.OPEN),
      Number(row.CLOSE),
      Number(row.LOW),
      Number(row.HIGH),
      (row.LABEL).toString()
      
      //row.LOW,
      //row.VOLUME
    ]);
  }
}
