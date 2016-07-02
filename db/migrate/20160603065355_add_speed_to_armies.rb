class AddSpeedToArmies < ActiveRecord::Migration
  def change
    add_column :armies, :speed, :integer
  end
end
