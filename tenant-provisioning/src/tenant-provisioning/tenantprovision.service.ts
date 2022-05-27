import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { ProvisionTenantDto } from './dto/provision.tenant.dto';
import { ProvisionTenantTableDto } from './dto/provision.tenant.table.dto';
import { SeedingDataeDto } from './dto/seeding-data.dto';
import { ConfigService } from '@nestjs/config';
import { ConnectionUtils } from './connection.utils';

@Injectable()
export class TenantprovisionService {
  private readonly logger: Logger;
  constructor(private readonly config: ConfigService) {
    this.logger = new Logger('Tenant Provision Service');
  }

  async createDatabase(
    tenant: ProvisionTenantDto,
  ): Promise<Record<string, any>> {
    const tenantName = tenant.tenantName;
    const password = tenant.password;
    const databaseName = tenant.databaseName;
    const query = readFileSync(
      `${__dirname}/scripts/create-database.sql`,
    ).toString();
    this.logger.log(`Creating tenant database ${databaseName} ...`);
    const DbConnection = ConnectionUtils.getConnection(this.config);

    return new Promise((res, rej) => {
      if (query) {
        DbConnection.query(
          query,
          [databaseName, tenantName, password],
          (err) => {
            if (err) {
              this.logger.error(
                `Error while creating database ${databaseName}: ${err}`,
              );
              rej(err);
            } else {
              ConnectionUtils.endConnection(DbConnection);
              this.logger.log(
                `Tenant database ${databaseName} created successfully`,
              );
              res({
                status: 'Database created successfully',
                database_name: databaseName,
              });
            }
          },
        );
      }
    });
  }

  async createTable(
    tableDetails: ProvisionTenantTableDto,
  ): Promise<Record<string, any>> {
    const dbName = tableDetails.dbName;
    const tableName = tableDetails.tableName;
    const columns = tableDetails.columns;

    const query = readFileSync(
      `${__dirname}/scripts/create-table.sql`,
    ).toString();
    const DbConnection = ConnectionUtils.getConnection(this.config);

    return new Promise((res, rej) => {
      DbConnection.query(
        query,
        [dbName, tableName, columns[0].columnName],
        (err) => {
          if (err) {
            rej(err);
          } else {
            ConnectionUtils.endConnection(DbConnection);
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
    const DbConnection = ConnectionUtils.getConnection(this.config);

    return new Promise((res, rej) => {
      DbConnection.query(
        query,
        [dbName, tableName, columns, values],
        (err) => {
          if (err) {
            rej(err);
          } else {
            ConnectionUtils.endConnection(DbConnection);
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
    const DbConnection = ConnectionUtils.getConnection(this.config);

    return new Promise((res, rej) => {
      DbConnection.query(query, [dbName, dbName], (err, result) => {
        if (err) {
          rej(err);
        } else {
          ConnectionUtils.endConnection(DbConnection);
          res({
            'Tenant-Database': result[0],
            'Tenant-Table': result[1],
          });
        }
      });
    });
  }
}
