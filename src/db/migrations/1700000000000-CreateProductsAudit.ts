import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductsAudit1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создаём таблицу аудита
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS products_audit (
        id          SERIAL PRIMARY KEY,
        oem VARCHAR NOT NULL,
        article VARCHAR NOT NULL,
        changed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        changes     JSONB NOT NULL
      );
    `);

    // Функция триггера
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION fn_products_audit()
      RETURNS TRIGGER AS $$
      DECLARE
        v_changes JSONB := '{}';
        v_col     TEXT;
        v_old_val TEXT;
        v_new_val TEXT;
      BEGIN
        -- Перебираем все колонки таблицы
        FOR v_col IN
          SELECT column_name
          FROM information_schema.columns
          WHERE table_name = 'products'
            AND column_name NOT IN ('lastUpdateDate') -- служебные поля пропускаем
        LOOP
          EXECUTE format('SELECT ($1).%I::TEXT', v_col) INTO v_old_val USING OLD;
          EXECUTE format('SELECT ($1).%I::TEXT', v_col) INTO v_new_val USING NEW;

          -- Записываем только реально изменившиеся поля
          IF v_old_val IS DISTINCT FROM v_new_val THEN
            v_changes := v_changes || jsonb_build_object(
              v_col,
              jsonb_build_object('old', v_old_val, 'new', v_new_val)
            );
          END IF;
        END LOOP;

        -- Пишем в аудит только если что-то реально изменилось
        IF v_changes <> '{}' THEN
          INSERT INTO products_audit (oem, article, changed_at, changes)
          VALUES (NEW.oem, NEW.article, NOW(), v_changes);
        END IF;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Вешаем триггер на UPDATE
    await queryRunner.query(`
      CREATE OR REPLACE TRIGGER trg_products_audit
      AFTER UPDATE ON products
      FOR EACH ROW EXECUTE FUNCTION fn_products_audit();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_products_audit ON products;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS fn_products_audit;`);
    await queryRunner.query(`DROP TABLE IF EXISTS products_audit;`);
  }
}
