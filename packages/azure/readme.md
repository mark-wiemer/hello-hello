# Hello Azure

Azure is Microsoft's cloud platform. I use it at work.

## General resources

- [Azure CLI - Microsoft Learn](https://learn.microsoft.com/en-us/cli/azure/?view=azure-cli-latest)
- [Cloud Adoption Framework - Microsoft Learn](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/)
- [Monthly Azure credits for Visual Studio subscribers](https://azure.microsoft.com/en-us/pricing/member-offers/credit-for-visual-studio-subscribers)
- [Pricing calculator - Microsoft Azure](https://azure.microsoft.com/en-gb/pricing/calculator/)

## CLI

- [JMESPath.org](https://jmespath.org/)
- [How to query Azure CLI command output using a JMESPath query - Microsoft Learn](https://learn.microsoft.com/en-us/cli/azure/use-azure-cli-successfully-query?view=azure-cli-latest&tabs=concepts%2Cbash)

When given an array of objects, to get a top-level prop, e.g. `displayName`:

```
[].displayName
```

```sh
az account list-locations --query [].displayName
```

## Location

```sh
az account list-locations
```

I prefer `westus2` for no particular reason.

## MFA

- [The impact of multifactor authentication on Azure CLI in automation scenarios](https://learn.microsoft.com/en-us/cli/azure/authenticate-azure-cli-mfa?view=azure-cli-latest)
  - Any automation tied to a user's permissions is a bad idea

## Naming conventions

- [Define your naming convention](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming) (includes examples)
- [Naming rules and restrictions](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-name-rules)

## Resources

```sh
az resource list --query [].id
```

### Resource groups

```sh
az group create -n rg-uat -l westus2
```

### Resource types

| Provider                      | Type                       |
| ----------------------------- | -------------------------- |
| Microsoft.App/containerApps   | Container App              |
| Microsoft.App/environments    | Container Apps Environment |
| Microsoft.ContainerRegistry   | Container registry         |
| Microsoft.ManagedIdentity     | Managed identity           |
| Microsoft.OperationalInsights | Log Analytics workspace    |
