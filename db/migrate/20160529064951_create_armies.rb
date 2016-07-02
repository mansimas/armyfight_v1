class CreateArmies < ActiveRecord::Migration
  def change
    create_table :armies do |t|
      t.integer :fight_id
      t.string :unit_name
      t.integer :hp_from
      t.integer :hp_to
      t.integer :dmg_from
      t.integer :dmg_to
      t.integer :def_inf_from
      t.integer :def_inf_to
      t.integer :def_hors_from
      t.integer :def_hors_to
      t.integer :def_arch_from
      t.integer :def_arch_to
      t.string :unit_type
      t.integer :columns
      t.integer :rows
      t.integer :x_pos
      t.integer :y_pos

      t.timestamps null: false
    end
  end
end
