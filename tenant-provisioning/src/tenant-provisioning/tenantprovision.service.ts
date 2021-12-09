import { Injectable, Res } from '@nestjs/common';
import { readFileSync } from 'fs';
import { db_connection } from './create-database';
import { ProvisionTenantDto } from './dto/provision.tenant.dto';
import { ProvisionTenantTableDto } from './dto/provision.tenant.table.dto';
import { SeedingDataeDto } from './dto/seeding-data.dto';

@Injectable()
export class TenantprovisionService {
    async createDatabase(tenant_name: ProvisionTenantDto) {
        const query = readFileSync(`${__dirname}/scripts/create-database.sql`).toString();

        return await new Promise((res, rej) => {
            if (query) {
                db_connection.query(query, ['db-' + tenant_name.tenantName], (err) => {
                    if (err) {
                        rej(err)
                    }
                    else {
                        res({
                            'status': 'Database created successfully',
                            'database_name': 'db-' + tenant_name.tenantName
                        })
                    }

                });
            }
        })
    }


    async createTable(table_details: ProvisionTenantTableDto) {
        const dbName = table_details.dbName;
        const tableName = table_details.tableName;
        const columns = table_details.columns;

        const query = readFileSync(`${__dirname}/scripts/create-table.sql`).toString();

        return await new Promise((res, rej) => {
            db_connection.connect((err) => {
                if (err) {
                    throw err;
                }
                console.log('connected')
            });

            db_connection.query(query, [dbName, tableName, columns[0].columnName], (err) => {
                if (err) {
                    rej(err)
                }
                else {
                    res({
                        'status': 'Table created successfully'
                    })
                }
            })
        })
    }
    async seed(data: SeedingDataeDto) {
        const dbName = data.dbName;
        const tableName = data.tableName;
        const columns = data.columnNames;
        const values = data.values;

        const query = readFileSync(`${__dirname}/scripts/seed-data.sql`).toString();

        return await new Promise((res, rej) => {
            db_connection.query(query, [dbName, tableName, columns, values], (err) => {
                if (err) {
                    rej(err)
                }
                else {
                    res({
                        'status': 'Data seeded successfully'
                    })
                }
            })
        })
    }
    async ping(tenantData: ProvisionTenantDto) {
        const dbName = 'db-' + tenantData.tenantName;

        const query = readFileSync(`${__dirname}/scripts/ping.sql`).toString();

        return await new Promise((res, rej) => {
            db_connection.query(query, [dbName, dbName], (err, result) => {
                if (err) {
                    rej(err)
                }
                else {
                    res({
                        'Tenant-Database': result[0],
                        'Tenant-Table': result[1]
                    })

                }
            })
        })
    }
}