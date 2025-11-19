import { connection } from "../connection";

import {
  selectCountOfUsersTemplate,
  selectUsersTemplate,
  selectUserByIdTemplate,
} from "./query-templates";
import { User } from "./types";

export const getUsersCount = (): Promise<number> =>
  new Promise((resolve, reject) => {
    connection.get<{ count: number }>(
      selectCountOfUsersTemplate,
      (error: any, results: { count: number | PromiseLike<number>; }) => {
        if (error) {
          reject(error);
        }
        resolve(results.count);
      }
    );
  });

export const getUsers = (
  pageNumber: number,
  pageSize: number
): Promise<User[]> =>
  new Promise((resolve, reject) => {
    connection.all<User>(
      selectUsersTemplate,
      [pageNumber * pageSize, pageSize],
      (error: any, results: User[] | PromiseLike<User[]>) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      }
    );
  });

export const getUserById = (userId: string): Promise<User | null> =>
  new Promise((resolve, reject) => {
    connection.get<User>(
      selectUserByIdTemplate,
      [userId],
      (error: any, result: User | PromiseLike<User | null> | undefined) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result || null);
      }
    );
  });
