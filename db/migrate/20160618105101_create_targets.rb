class CreateTargets < ActiveRecord::Migration
  def change
    create_table :targets do |t|
      t.integer :army_id
      t.integer :x
      t.integer :y

      t.timestamps null: false
    end
  end
end
