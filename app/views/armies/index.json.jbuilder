json.array!(@armies) do |army|
  json.extract! army, :id, :fight_id, :unit_name, :hp_from, :hp_to, :dmg_from, :dmg_to, :def_inf_from, :def_inf_to, :def_hors_from, :def_hors_to, :def_arch_from, :def_arch_to, :unit_type, :columns, :rows, :x_pos, :y_pos
  json.url army_url(army, format: :json)
end
