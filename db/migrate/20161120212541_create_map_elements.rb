class CreateMapElements < ActiveRecord::Migration
  def change
    create_table :map_elements do |t|
      t.integer :fight_id
      t.string :color
      t.string :shape
      t.text :elements

      t.timestamps null: false
    end
  end
end
