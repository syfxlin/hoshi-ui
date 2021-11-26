import useToast from "../utils/use-toast";
import {
  AddRoleView,
  adminAddRole,
  adminDeleteRole,
  adminListRoles,
  adminUpdateRole,
  UpdateRoleView,
} from "./admin";
import useSWRMap from "../utils/use-swr-map";
import { RoleView } from "./ums";

const useRoles = () => {
  const toast = useToast();

  const query = useSWRMap<string, RoleView>("admin/roles", async () => {
    const entity = await adminListRoles();
    return new Map(entity.data?.map((role) => [role.name, role]));
  });

  const $addRole = (role: AddRoleView) =>
    adminAddRole(role)
      .then(
        toast.api.success({
          title: "新增成功",
        })
      )
      .then((res) => {
        const data = res.data as RoleView;
        query.add(data.name, data);
        return res;
      })
      .catch(
        toast.api.error({
          title: "新增失败",
        })
      );

  const $updateRole = (role: UpdateRoleView) =>
    adminUpdateRole(role)
      .then(
        toast.api.success({
          title: "修改成功",
        })
      )
      .then((res) => {
        const data = res.data as RoleView;
        query.set(data.name, () => data);
        return res;
      })
      .catch(
        toast.api.error({
          title: "修改失败",
        })
      );

  const $deleteRole = (name: string) =>
    adminDeleteRole(name)
      .then(
        toast.api.success({
          title: "删除成功",
        })
      )
      .then((res) => {
        query.remove(name);
        return res;
      })
      .catch(
        toast.api.error({
          title: "删除失败",
        })
      );

  return {
    ...query,
    $addRole,
    $updateRole,
    $deleteRole,
  };
};

export default useRoles;
