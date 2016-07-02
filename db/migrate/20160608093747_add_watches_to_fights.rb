class AddWatchesToFights < ActiveRecord::Migration
  def change
    add_column :fights, :watched, :integer
  end
end
