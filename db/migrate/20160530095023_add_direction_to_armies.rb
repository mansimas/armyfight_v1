class AddDirectionToArmies < ActiveRecord::Migration
  def change
    add_column :armies, :direction, :string
  end
end
