class AddDescriptionToFights < ActiveRecord::Migration
  def change
    add_column :fights, :description, :text
  end
end
