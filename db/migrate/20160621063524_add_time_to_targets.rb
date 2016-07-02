class AddTimeToTargets < ActiveRecord::Migration
  def change
    add_column :targets, :stay_time, :integer
  end
end
