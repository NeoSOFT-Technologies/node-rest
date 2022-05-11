import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { ProvisionTenantDto } from './dto/provision.tenant.dto';
import { ProvisionTenantTableDto } from './dto/provision.tenant.table.dto';
import { SeedingDataeDto } from './dto/seeding-data.dto';
import { ConfigService } from '@nestjs/config';
import { ConnectionUtils } from './connection.utils';

@Injectable()
export class TenantprovisionService {
  constructor(private config: ConfigService) {}

  async createDatabase(
    tenant: ProvisionTenantDto,
  ): Promise<Record<string, any>> {
    const tenantName = tenant.tenantName;
    const password = tenant.password;
    const query = readFileSync(
      `${__dirname}/scripts/create-database.sql`,
    ).toString();
    const db_connection = ConnectionUtils.getConnection(this.config);

    return await new Promise((res, rej) => {
      if (query) {
        db_connection.query(
          query,
          ['db-' + tenantName, tenantName, password],
          (err) => {
            if (err) {
              rej(err);
            } else {
              ConnectionUtils.endConnection(db_connection);
              res({
                status: 'Database created successfully',
                database_name: 'db-' + tenantName,
              });
            }
          },
        );
      }
    });
  }

  async createTable(
    table_details: ProvisionTenantTableDto,
  ): Promise<Record<string, any>> {
    const dbName = table_details.dbName;
    const tableName = table_details.tableName;
    const columns = table_details.columns;

    const query = readFileSync(
      `${__dirname}/scripts/create-table.sql`,
    ).toString();
    const db_connection = ConnectionUtils.getConnection(this.config);

    return await new Promise((res, rej) => {
      db_connection.query(
        query,
        [dbName, tableName, columns[0].columnName],
        (err) => {
          if (err) {
            rej(err);
          } else {
            ConnectionUtils.endConnection(db_connection);
            res({
              status: 'Table created successfully',
            });
          }
        },
      );
    });
  }
  async seed(data: SeedingDataeDto): Promise<Record<string, any>> {
    const dbName = data.dbName;
    const tableName = data.tableName;
    const columns = data.columnNames;
    const values = data.values;

    const query = readFileSync(`${__dirname}/scripts/seed-data.sql`).toString();
    const db_connection = ConnectionUtils.getConnection(this.config);

    return await new Promise((res, rej) => {
      db_connection.query(
        query,
        [dbName, tableName, columns, values],
        (err) => {
          if (err) {
            rej(err);
          } else {
            ConnectionUtils.endConnection(db_connection);
            res({
              status: 'Data seeded successfully',
            });
          }
        },
      );
    });
  }
  async ping(tenantData: ProvisionTenantDto): Promise<Record<string, any>> {
    const dbName = 'db-' + tenantData.tenantName;

    const query = readFileSync(`${__dirname}/scripts/ping.sql`).toString();
    const db_connection = ConnectionUtils.getConnection(this.config);

    return await new Promise((res, rej) => {
      db_connection.query(query, [dbName, dbName], (err, result) => {
        if (err) {
          rej(err);
        } else {
          ConnectionUtils.endConnection(db_connection);
          res({
            'Tenant-Database': result[0],
            'Tenant-Table': result[1],
          });
        }
      });
    });
  }
}
