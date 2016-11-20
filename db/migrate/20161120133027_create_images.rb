class CreateImages < ActiveRecord::Migration
  def change
    create_table :images do |t|
      t.string :name
      t.text :file_name
      t.decimal :size
      t.string :image_type

      t.timestamps null: false
    end
  end
end
