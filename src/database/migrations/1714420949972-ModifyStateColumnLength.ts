import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ModifyStateColumnLength1714420949972
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "address",
      "state",
      new TableColumn({
        name: "state",
        type: "varchar",
        length: "2",
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "address",
      "state",
      new TableColumn({
        name: "state",
        type: "varchar",
        length: "100",
        isNullable: false,
      }),
    );
  }
}
