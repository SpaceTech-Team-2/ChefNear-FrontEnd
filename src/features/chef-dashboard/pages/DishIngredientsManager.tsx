import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit2, Check, X, Loader2 } from "lucide-react";
import {
  getIngredients,
  addIngredient,
  updateIngredient,
  deleteIngredient,
} from "../../../services/api";

interface Ingredient {
  id: string;
  name: string;
  quantity: string;
}

export default function DishIngredientsManager({ dishId }: { dishId: string }) {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editQuantity, setEditQuantity] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["dish-ingredients", dishId],
    queryFn: () => getIngredients(dishId),
  });
  const ingredients: Ingredient[] = data?.data ?? [];

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["dish-ingredients", dishId] });

  const addMutation = useMutation({
    mutationFn: () => addIngredient({ dishId, name: newName, quantity: newQuantity }),
    onSuccess: () => {
      setNewName("");
      setNewQuantity("");
      invalidate();
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateIngredient({ ingredientId: editingId as string, name: editName, quantity: editQuantity }),
    onSuccess: () => {
      setEditingId(null);
      invalidate();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteIngredient(id),
    onSuccess: invalidate,
  });

  const startEdit = (ing: Ingredient) => {
    setEditingId(ing.id);
    setEditName(ing.name);
    setEditQuantity(ing.quantity);
  };

  return (
    <div className="space-y-2.5">
      <label className="text-xs font-bold text-gray-600">المكوّنات</label>

      {isLoading && <div className="h-16 bg-rose-50 rounded-xl animate-pulse" />}

      {!isLoading && (
        <div className="space-y-1.5">
          {ingredients.map((ing) =>
            editingId === ing.id ? (
              <div key={ing.id} className="flex items-center gap-1.5">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 text-xs border border-rose-100 rounded-lg px-2 py-1.5 outline-none"
                  placeholder="الاسم"
                />
                <input
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                  className="w-20 text-xs border border-rose-100 rounded-lg px-2 py-1.5 outline-none"
                  placeholder="الكمية"
                />
                <button
                  type="button"
                  onClick={() => updateMutation.mutate()}
                  disabled={updateMutation.isPending}
                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                key={ing.id}
                className="flex items-center justify-between bg-[#FFF8F6] border border-rose-100 rounded-lg px-3 py-1.5 text-xs"
              >
                <span className="text-gray-700">
                  {ing.name} <span className="text-gray-400">— {ing.quantity}</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(ing)}
                    className="p-1 text-gray-400 hover:text-[#B34510]"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(ing.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      <div className="flex items-center gap-1.5">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="اسم المكوّن"
          className="flex-1 text-xs bg-white border border-rose-100 rounded-lg px-2 py-1.5 outline-none focus:border-[#B34510]"
        />
        <input
          value={newQuantity}
          onChange={(e) => setNewQuantity(e.target.value)}
          placeholder="الكمية"
          className="w-20 text-xs bg-white border border-rose-100 rounded-lg px-2 py-1.5 outline-none focus:border-[#B34510]"
        />
        <button
          type="button"
          onClick={() => addMutation.mutate()}
          disabled={addMutation.isPending || !newName || !newQuantity}
          className="p-1.5 bg-[#B34510] text-white rounded-lg disabled:opacity-50"
        >
          {addMutation.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Plus className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
